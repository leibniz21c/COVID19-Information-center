function getDateStr(date) {
    var year = date.getFullYear().toString();
    var month = date.getMonth() + 1;
    if (month < 10) month = '0' + month.toString();
    else month = month.toString();
    var day = date.getDate();
    if (day < 10) day = '0' + day.toString();
    else day = day.toString();

    return year + month + day;
}