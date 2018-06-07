$(document).ready(function(){
    loadCalendar();
});
    
function loadCalendar(){
    //gfet current date
    var date = new Date();
    //extrapolate year/month/date/day
    var year = date.getFullYear();
    var month = date.getMonth();
    var dateOfMonth = date.getDate();
    var day = date.getDay();
    //get first day of month
    var firstOfMonth = new Date(year, month, 1, 0,0,0,0);
    var firstDay = firstOfMonth.getDay();
    //build base table contents

    var calendarTable = "";
    // create table elements
    calendarTable += buildTableHeader(); //day headers
    calendarTable += buildTableRows(); //rows of days
    //build inner html into table element
    $("#calTable").html(calendarTable);

    //Fill dates
    fillDates(month, year, firstDay);
    //Fill in day headers
    setHeaderText();
    //Fill in dates per day
    setDayText(month);
}

function buildTableHeader(){
    var headHTML = "<tr>"; //open row
    for (let d = 0; d < 7; d++) {
        headHTML += `<th id="dayOfWeek${d}"></th>`;       
    }
    headHTML += "</tr>" //close row

    return headHTML;
}

function buildTableRow(row){
    var rowHTML = "<tr>"; //open row
    for (let d = 0; d < 7; d++) {
        rowHTML += `<td id="col${d}row${row}"></td>`;       
    }
    rowHTML += "</tr>" //close row

    return rowHTML;
}

function buildTableRows()
{
    var rowsHTML ="";
    for (let i = 0; i < 6; i++) {
        rowsHTML += buildTableRow(i);        
    }

    return rowsHTML;
}

function fillDates(month, year, first)
{
    

    var col = first; //column, starting on first day
    var row = 0; //row number
    var date = 1; //date counter

    //change ids of the days of the week to the correct dates
    while (date < getDaysInMonth(month) + 1) {
        if (col > 6)
        { //roll to next week
            col = 0;
            row += 1;
        }
        var elementID = `#col${col}row${row}`; //create id string
        $(elementID).attr("id", `cellDay${date}`);
        //increment counters
        col += 1;
        date += 1;
    }
 
}

function setHeaderText(){
    $("#dayOfWeek0").html("<h2>Sunday</h2>");
    $("#dayOfWeek1").html("<h2>Monday</h2>");
    $("#dayOfWeek2").html("<h2>Tuesday</h2>");
    $("#dayOfWeek3").html("<h2>Wednesday</h2>");
    $("#dayOfWeek4").html("<h2>Thursday</h2>");
    $("#dayOfWeek5").html("<h2>Friday</h2>");
    $("#dayOfWeek6").html("<h2>Saturday</h2>");
}

function setDayText(month){
    currMo = getDaysInMonth(month);

    for (let i = 1; i < currMo + 1; i++) {
        $(`#cellDay${i}`).html(`${i}`);    
    }
}

function getDaysInMonth(month)
{
    var currMo;

    switch (month + 1) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            currMo = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            currMo = 30;
            break;
        case 2:
            if (year % 4 == 0) {
                currMo = 29;
            }
            else{
                currMo = 28;
            }            
        default:
            break;
    }

    return currMo;
}