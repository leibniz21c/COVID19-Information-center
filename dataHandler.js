function Term(stateDt, exposed, died, infected, recovered) {
    /*
        Data term for SEIR model.
        Date : stateDt
        Susceptible : susceptible
        Exposed : exposed
        Infected : infected
        Recovered : recovered
    */
    this.stateDt = stateDt;
    this.exposed = exposed;
    this.died = died;
    this.infected = infected;
    this.recovered = recovered;
    this.todayRecovered = 0;
    this.susceptible = 50000000 - this.exposed - this.died - this.infected - this.recovered;

    function _consolePrintTerm() {
        console.log("[DEBUG] : ");
        console.log("Date : " + this.stateDt);
        console.log("Susceptible : " + this.susceptible);
        console.log("Exposed : " + this.exposed);
        console.log("Infected : " + this.infected);
        console.log("Recovered : " + this.recovered);
    }

}