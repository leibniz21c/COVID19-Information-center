// Latest File path setting
// If you want to update the xml file,
// you just have to modify this file. 

// Modify this part.
var fileName = 'covid_data_20210426.xml';

// Don't modify these parts.
function getCovidUrlInHome() {
    return '../data/covid/' + fileName;
}

function getCovidUrlInOverview() {
    return '../../data/covid/' + fileName;
}

function getCovidUrlInSIR_prediction() {
    return '../../data/covid/' + fileName;
}