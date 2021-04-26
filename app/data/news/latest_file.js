// Latest File path setting
// If you want to update the xml file,
// you just have to modify this file. 

// Modify this part.
var fileName = 'news_data_20210426.json';

// Don't modify these parts.
function getNewsUrlInHome() {
    return '../data/news/' + fileName;
}

function getNewsUrlInOverview() {
    return '../../data/news/' + fileName;
}

function getNewsUrlInSIR_prediction() {
    return '../../data/news/' + fileName;
}