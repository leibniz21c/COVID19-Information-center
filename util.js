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

    this.simulate = function (date) {
        var day = new Date();
        if (this.available) {
            for (var i = 0 ;i < date ;i ++) {
                // dSdt == derivates[0]
                // dIdt == derivates[1]
                // dRdt == derivates[2]
                let derivates = this.dataset[this.dataset.length - 1]
                                    .getDerivates(this.beta, this.gamma, this.a);    
                day.setDate(day.getDate() + 1);                            
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
    };

    this.writeMetadata = function() {
        document.write("stateDt,susceptible,infected,recovered,died<br>");
    };

    this.writeDocument = function() {
        for (var i = 0; i < this.dataset.length; i++) {
            document.write(
                this.dataset[i].stateDt + "," + this.dataset[i].susceptible + "," + this.dataset[i].infected + "," + this.dataset[i].recovered + "," + this.dataset[i].died + "<br>");
        }
    };

    // Getter for stateDt array
    this.getLabels = function () {
        var labels = [];
    
        this.dataset.forEach(function (item) {
            labels.push(item.getLabel());
        });
        return labels;
    };

    // Getter for infected array
    this.getInfected = function () {
        var infected = [];

        this.dataset.forEach(function (item) {
            infected.push(item.infected);
        });
        return infected;
    };

    // Getter for susceptibles array
    this.getSusceptibles = function () {
        var susceptibles = [];

        this.dataset.forEach(function (item) {
            susceptibles.push(item.susceptible);
        });
        return susceptibles;
    };
    
    // Getter for recovered array
    this.getRecovered = function () {
        var recovered = [];

        this.dataset.forEach(function (item) {
            recovered.push(item.recovered);
        });
        return recovered;
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
    this.deltaDied = 0;

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

    this.getLabel = function() {
        // stateDt ex : 20200305
        // return : "2020.3.5"
        var year = parseInt(this.stateDt/10000);
        var month = parseInt(this.stateDt%10000/100);
        var day = parseInt(this.stateDt%100);
        return year + "." + month + "." + day;
    };
}


function getDateStr(date) {
    // Date object to date string like "20200513".
    var year = date.getFullYear().toString();
    var month = date.getMonth() + 1;
    if (month < 10) month = '0' + month.toString();
    else month = month.toString();
    var day = date.getDate();
    if (day < 10) day = '0' + day.toString();
    else day = day.toString();

    return year + month + day;
}
