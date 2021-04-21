function SIR() {
    /*
        SIR model
        dataset : Array of Data object
            Data :
                Date : stateDt
                Susceptible : susceptible
                Infected : infected
                Recovered : recovered
        available : After evalDelta() it has true.

    */
    this.dataset = [];
    this.available = false;

    // SEIR parameters
    /* 
    Reference : https://www.medrxiv.org/content/10.1101/2020.04.13.20063412v1.full.pdf 
    In this paper, the values of \beta and \gamma are 0.0254 and 0.0670 on the page 6.
    */
    this.beta = 0.0253;
    this.gamma = 0.0670;
    /*
    Reference : https://m.health.chosun.com/svc/news_view.html?contid=2020062902672
    In this article, the value of \a is 0.05 because duration of disease is 20 days.
    (\a is inverse of duration.)
    */
    this.a = 0.05;
    // Just calculating with these dataset (average die probablity)
    this.diedProb = 0.0;

    this.appendData = function (data) {
        /*
        Append Data() to data array.
        Must be ordered by stateDt
        */
        this.dataset.unshift(data);
        this.available = false;
    };

    this.evalDelta = function () {
        var sumOfDiedProbability = 0.0;
        this.dataset.sort(function (a, b) {
            if (a.stateDt > b.stateDt) return 1;
            else if (a.stateDt == b.stateDt) return 0;
            return -1;
        });

        // Calculating Died Probability
        for (var i = 1; i < this.dataset.length; i++) {
            this.dataset[i].deltaDied = this.dataset[i].died - this.dataset[i - 1].died;
            sumOfDiedProbability += this.dataset[i].deltaDied / this.dataset[i - 1].infected;
        }
        this.diedProb = sumOfDiedProbability / this.dataset.length;

        this.available = true;
    };

    this.getMoreData = function (date) {
        import getDateStr from 'mydateHandler.js';

        var day = new Date();
        if (this.available) {
            for (var i = 0 ;i < date ;i ++) {
                // dSdt == derivates[0]
                // dIdt == derivates[1]
                // dRdt == derivates[2]
                let derivates = this.dataset[this.dataset.length - 1]
                                    .getDerivates(this.beta, this.gamma, this.a);    
                day.setDate(today.getDate() + 1);                            
                this.dataset.push(
                    new Data(
                        getDateStr(day),
                        this.dataset[this.dataset.length-1].died + this.dataset[this.dataset.length-1].infected*this.diedProb,
                        this.dataset[this.dataset.length-1].infected + derivates[1],
                        this.dataset[this.dataset.length-1].recovered + derivates[2],
                        this.dataset[this.dataset.length-1].susceptible + derivates[0],
                    )
                )
            }
            
            return true;
        }
        return false;
    }

    this.writeMetadata = function() {
        document.write("stateDt,susceptible,infected,recovered,died<br>");
    };

    this.writeDocument = function() {
        for (var i = 0; i < this.dataset.length; i++) {
            document.write(
                this.dataset[i].stateDt + "," + this.dataset[i].susceptible + "," + this.dataset[i].infected + "," + this.dataset[i].recovered + "," + this.dataset[i].died + "," + "<br>");
        }
    };


}

function Data(stateDt, died, infected, recovered, susceptible)
{
    // Initial data
    this.stateDt = stateDt;
    this.died = died;
    this.infected = infected;
    this.recovered = recovered;
    if (susceptible == 0)
        this.susceptible = 50000000 - this.died - this.infected - this.recovered;
    else 
        this.susceptible = susceptible;

    // Processable data
    this.deltaDies = 0;

    this.getDerivates = function (beta, gamma, a) {
        /*
            return - rate of change of S, E, I, R by t
            argument -
                beta : infection rate per day
                gamma : recovery rate per day
                a : average latency
        */
        var dSdt = -beta*this.susceptible*this.infected/50000000;
        var dIdt = beta*this.infected*this.susceptible/50000000 - gamma*this.infected;
        var dRdt = gamma*this.infected;

        return [dSdt, dIdt, dRdt];
    };
}