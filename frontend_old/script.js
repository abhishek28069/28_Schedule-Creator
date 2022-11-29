let schedule = [];

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

const edit = () => {
  let rows = document.getElementsByTagName("tr");
  for (let i = 0; i < rows.length - 1; i++) {
    let cols = rows[i + 1].querySelectorAll("td,th");
    if (schedule[i] == "E") {
      cols[0].contentEditable = true;
    }
  }
};

const save = () => {
  let rows = document.getElementsByTagName("tr");
  for (let i = 0; i < rows.length - 1; i++) {
    let cols = rows[i + 1].querySelectorAll("td,th");
    if (schedule[i] == "E") {
      cols[0].contentEditable = false;
    }
  }
};

const tableToCSV = () => {
  let csv_data = "";
  // Get each row data
  let rows = document.getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    // Get each column data
    let cols = rows[i].querySelectorAll("td,th");

    // Stores each csv row data
    let j = 0;
    for (j = 0; j < cols.length - 1; j++) {
      // Get the text data of each cell of
      // a row and push it to csvrow
      csv_data += cols[j].innerHTML + ",";
    }
    csv_data += cols[j].innerHTML;
    csv_data += "\n";
  }
  // combine each row data with new line character
  csv_data += "\n";
  /* We will use this function later to download
  the data in a csv file downloadCSVFile(csv_data);
  */
  download(csv_data);
};

const download = (csv_data) => {
  // Create CSV file object and feed our
  // csv_data into it
  CSVFile = new Blob([csv_data], { type: "text/csv" });

  // Create to temporary link to initiate
  // download process
  var temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = "GfG.csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
};

function get_total_duration(start, end) {
  var duration;
  var start_hour = Number(start.slice(0, 2));
  var start_minutes = Number(start.slice(3, 5));
  console.log(start_hour);
  var ans = start_hour + start_minutes;
  var is_start_am;
  if (start[6] == "A") {
    is_start_am = true;
  } else {
    is_start_am = false;
  }
  var end_hour = Number(end.slice(0, 2));
  var end_minutes = Number(end.slice(3, 5));
  var is_end_am;
  if (end[6] == "A") {
    is_end_am = true;
  } else {
    is_end_am = false;
  }
  if (!is_end_am && end_hour === 12) {
    end_hour = 0;
  }
  if (!is_start_am && start_hour === 12) {
    start_hour = 0;
  }
  if ((is_start_am && is_end_am) || (!is_start_am && !is_end_am)) {
    if (end_minutes < start_minutes) {
      duration = (end_hour - start_hour - 1) * 60 + (60 + end_minutes - start_minutes);
    } else {
      duration = (end_hour - start_hour) * 60 + (end_minutes - start_minutes);
    }
  } else {
    if (end_minutes < start_minutes) {
      duration = (12 + end_hour - start_hour - 1) * 60 + (60 + end_minutes - start_minutes);
    } else {
      duration = (12 + end_hour - start_hour) * 60 + (end_minutes - start_minutes);
    }
  }

  console.log(duration);
  return duration;
}

function get_schedule(schedule, start_time, one_event_duration, total_break_time, breaks) {
  let one_break_time = Math.floor(total_break_time / breaks);
  let last_break_time = total_break_time - one_break_time * (breaks - 1);
  let break_count = 1;
  let current_hour = parseInt(start_time.substring(0, 2));
  let current_minutes = parseInt(start_time.substring(3, 5));
  let period = start_time.substring(6, 8);
  let curr_min_str = "";
  let out_str = "";
  let start_str = "";
  let end_str = "";

  for (let i = 0; i < schedule.length; i++) {
    out_str = "";
    start_str = "";
    end_str = "";
    if (schedule[i] == "E") {
      out_str += "Event: ";
    } else {
      out_str += "Break: ";
    }
    if (current_minutes < 10) {
      curr_min_str = "0" + current_minutes.toString();
    } else {
      curr_min_str = current_minutes.toString();
    }
    out_str += current_hour + ":" + curr_min_str + " " + period + "-";
    start_str += current_hour + ":" + curr_min_str + " " + period;

    if (schedule[i] == "E") {
      current_minutes += one_event_duration;
    } else {
      if (break_count < breaks) {
        current_minutes += one_break_time;
        break_count++;
      } else {
        current_minutes += last_break_time;
      }
    }

    if (current_minutes >= 60) {
      current_hour += Math.floor(current_minutes / 60);
      if (current_hour > 11 && period == "AM") {
        period = "PM";
      }
      if (current_hour > 12) {
        current_hour -= 12;
      }
      current_minutes = current_minutes % 60;
    }

    if (current_minutes < 10) {
      curr_min_str = "0" + current_minutes.toString();
    } else {
      curr_min_str = current_minutes.toString();
    }
    out_str += current_hour + ":" + curr_min_str + " " + period;
    end_str += current_hour + ":" + curr_min_str + " " + period;
    insertRow(schedule[i] === "E" ? "Event" : "Break", start_str, end_str);
    console.log(out_str);
  }
}

// let start_time = prompt("Enter start time in format HH:MM AM/PM:");
// let end_time = prompt("Enter end time in format HH:MM AM/PM:");
// let events = prompt("Enter number of events:");
// let breaks = prompt("Enter number of breaks:");
let start_time;
let end_time;
let no_events;
let breaks;

const convertTime = (t) => {
  console.log(t);
  var hours = t.slice(0, 2);
  var minutes = t.slice(3, 5);
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = hours < 10 ? "0" + hours : hours;
  var strTime = hours + ":" + minutes + " " + ampm;
  console.log(strTime);
  return strTime;
};

const takeInput = () => {
  const myStart = document.getElementById("start");
  const myEnd = document.getElementById("end");
  const myEvents = document.getElementById("events");
  const myBreaks = document.getElementById("breaks");
  start_time = convertTime(myStart.value);
  end_time = convertTime(myEnd.value);
  no_events = myEvents.value;
  breaks = myBreaks.value;
  console.log(myStart.value);
  const myTable = document.getElementById("scheduleTable");
  myTable.innerHTML = "";
  var row = myTable.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.outerHTML = "<th>Schedule</th>";
  cell2.outerHTML = "<th>Start</th>";
  cell3.outerHTML = "<th>End</th>";

  main();
};

document.getElementById("schedule").addEventListener("click", takeInput);

const main = () => {
  no_events = parseInt(no_events);
  breaks = parseInt(breaks);

  let total_duration = get_total_duration(start_time, end_time);
  let one_event_duration = Math.floor(total_duration / (no_events + 1));
  let total_break_time = total_duration - one_event_duration * no_events;

  console.log("One Event Duration: " + one_event_duration);
  console.log("Total Break Time: " + total_break_time);

  let breaks_finished = 0;
  schedule = [];
  while (no_events) {
    let num = no_events / (breaks + 1 - breaks_finished);
    let num_ceil = Math.ceil(num);
    no_events -= num_ceil;
    while (num_ceil--) {
      schedule.push("E");
    }
    if (breaks_finished == breaks) break;
    schedule.push("B");
    breaks_finished++;
  }

  while (no_events--) {
    schedule.push("E");
  }

  get_schedule(schedule, start_time, one_event_duration, total_break_time, breaks);
  if (document.getElementsByClassName("margin").length === 0)
    document.getElementsByClassName("pad")[0].insertAdjacentHTML("afterend", '<div class="margin"></div>');
};
