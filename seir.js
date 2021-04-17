function seir(data, beta, gamma, a) {
    /*
        return - rate of change of S, E, I, R by t
        argument -
            beta : infection rate per day
            gamma : recovery rate per day
            a : average latency
    */
    var S = data.susceptible;
    var E = data.exposed;
    var I = data.infected;
    var R = data.recovered;
    dSdt = -beta*S*I;
    dEdt = beta*S*I - a*E;
    dIdt = a*E - gamma*I;
    dRdt = gamma*I;
    return [dSdt, dEdt, dIdt, dRdt];
}
