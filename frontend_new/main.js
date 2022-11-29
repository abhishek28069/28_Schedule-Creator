import { create_schedule } from "schedule_creator_ssd_team_28";

//global variables
let scheduleCSV = "";
let scheduleJSON = [];

//helper functions
const convertTime = (t) => {
  var hours = t.slice(0, 2);
  var minutes = t.slice(3, 5);
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = hours < 10 ? "0" + hours : hours;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

const takeInput = () => {
  const myStart = document.getElementById("start");
  const myEnd = document.getElementById("end");
  const myEvents = document.getElementById("events");
  const myBreaks = document.getElementById("breaks");
  let start_time = convertTime(myStart.value);
  let end_time = convertTime(myEnd.value);
  let no_events = parseInt(myEvents.value);
  let breaks = parseInt(myBreaks.value);
  // const myTable = document.getElementById("scheduleTable");
  // myTable.innerHTML = "";
  // var row = myTable.insertRow();
  // var cell1 = row.insertCell(0);
  // var cell2 = row.insertCell(1);
  // var cell3 = row.insertCell(2);
  // cell1.outerHTML = "<th>Schedule</th>";
  // cell2.outerHTML = "<th>Start</th>";
  // cell3.outerHTML = "<th>End</th>";
  return { start_time, end_time, no_events, breaks };
};

const insertRow = (firstCell, secondCell, thirdCell) => {
  const myTable = document.getElementById("scheduleTable");
  var row = myTable.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = firstCell;
  cell2.innerHTML = secondCell;
  cell3.innerHTML = thirdCell;
  if (firstCell === "Break") {
    row.style.backgroundColor = "#3d3d3d";
  }
};

const displayTable = (data) => {
  const myTable = document.getElementById("scheduleTable");
  myTable.innerHTML = "";
  var row = myTable.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.outerHTML = "<th>Schedule</th>";
  cell2.outerHTML = "<th>Start</th>";
  cell3.outerHTML = "<th>End</th>";
  data.forEach((element) => {
    insertRow(element.type, element.start_time, element.end_time);
  });
  if (document.getElementsByClassName("margin").length === 0)
    document.getElementsByClassName("pad")[0].insertAdjacentHTML("afterend", '<div class="margin"></div>');
};

//handler functions
const main = () => {
  let { start_time, end_time, no_events, breaks } = takeInput();
  scheduleJSON = create_schedule(start_time, end_time, no_events, breaks, "json");
  scheduleCSV = create_schedule(start_time, end_time, no_events, breaks, "csv");
  console.log(scheduleCSV, scheduleJSON);
  displayTable(scheduleJSON);
};

const edit = () => {
  let rows = document.getElementsByTagName("tr");
  for (let i = 0; i < rows.length - 1; i++) {
    let cols = rows[i + 1].querySelectorAll("td,th");
    if (cols[0].innerHTML !== "Break") {
      cols[0].contentEditable = true;
    }
  }
};

const save = () => {
  let rows = document.getElementsByTagName("tr");
  for (let i = 0; i < rows.length - 1; i++) {
    let cols = rows[i + 1].querySelectorAll("td,th");
    if (cols[0].innerHTML !== "Break") {
      cols[0].contentEditable = false;
    }
  }
};

const downloadCSV = (csv_data) => {
  let CSVFile = new Blob([csv_data], { type: "text/csv" });

  // Create to temporary link to initiate
  var temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = "schedule.csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
};

const downloadJSON = (json_data) => {
  json_data = JSON.stringify(json_data);
  let JSONFile = new Blob([json_data], { type: "text/json" });

  // Create to temporary link to initiate
  var temp_link = document.createElement("a");

  // Download json file
  temp_link.download = "schedule.json";
  var url = window.URL.createObjectURL(JSONFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
};

//event handlers
document.getElementById("schedule").addEventListener("click", main);
document.getElementById("downloadCSV").addEventListener("click", () => downloadCSV(scheduleCSV));
document.getElementById("downloadJSON").addEventListener("click", () => downloadJSON(scheduleJSON));
document.getElementById("edit").addEventListener("click", edit);
document.getElementById("save").addEventListener("click", save);
