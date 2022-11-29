const get_total_duration = (start, end) => {
  let duration;
  // processing start
  let start_hour = Number(start.slice(0, 2));
  let start_minutes = Number(start.slice(3, 5));
  let is_start_am;
  if (start[6] == "A") {
    is_start_am = true;
  } else {
    is_start_am = false;
  }
  // processing end
  let end_hour = Number(end.slice(0, 2));
  let end_minutes = Number(end.slice(3, 5));
  let is_end_am;
  if (end[6] == "A") {
    is_end_am = true;
  } else {
    is_end_am = false;
  }
  // adjusting for edge cases
  if (!is_end_am && end_hour === 12) {
    end_hour = 0;
  }
  if (!is_start_am && start_hour === 12) {
    start_hour = 0;
  }
  //calculating duration
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
  return duration;
};

const get_schedule = (event_type, start_time, one_event_duration, total_break_time, breaks, output_format) => {
  let one_break_time = Math.floor(total_break_time / breaks);
  let last_break_time = total_break_time - one_break_time * (breaks - 1);
  let break_count = 1;
  let current_hour = parseInt(start_time.substring(0, 2));
  let current_minutes = parseInt(start_time.substring(3, 5));
  let period = start_time.substring(6, 8);
  let curr_min_str = "";
  let start_str = "";
  let end_str = "";
  let noon = "";
  //defining return variable
  let schedule;
  if (output_format == "json") {
    schedule = [];
  } else if (output_format == "csv") {
    schedule = "";
  }
  for (let i = 0; i < event_type.length; i++) {
    start_str = "";
    end_str = "";

    if (current_minutes < 10) {
      curr_min_str = "0" + current_minutes.toString();
    } else {
      curr_min_str = current_minutes.toString();
    }
    start_str += current_hour + ":" + curr_min_str + " " + period;

    if(current_hour < 12 && period == "AM") {
      noon = "Morning Events"
    } else if((current_hour == 12 && period == "PM") || (current_hour < 4 && period == "PM")) {
      noon = "Afternoon Events"
    } else if(current_hour < 8 && period == "PM") {
      noon = "Evening Events"
    } else {
      noon = "Night Events"
    }

    if (event_type[i] == "E") {
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
    end_str += current_hour + ":" + curr_min_str + " " + period;

    if (output_format == "json") {
      let type = event_type[i] === "E" ? "Event" : "Break";
      schedule.push({ type: type, start_time: start_str, end_time: end_str, desc_time: noon });
    } else if (output_format == "csv") {
      let type = event_type[i] === "E" ? "Event" : "Break";
      schedule += type + "," + start_str + "," + end_str + "\n";
    }
  }
  // if (output_format == "json") {
  //   schedule.unshift(schedule_name);
  //   schedule.unshift(schedule_date);
  // } else if (output_format == "csv") {
  //   schedule = schedule_name + "\n" + schedule_date + "\n" + schedule;
  // }
  return schedule;
};

exports.create_schedule = (start_time, end_time, no_events, breaks, output_format = "json") => {
  // start_time and end_time of format HH:MM AM/PM
  // no_events and breaks is of type int
  let total_duration = get_total_duration(start_time, end_time);
  let one_event_duration = Math.floor(total_duration / (no_events + 1));
  let total_break_time = total_duration - one_event_duration * no_events;

  console.log("One Event Duration: " + one_event_duration);
  console.log("Total Break Time: " + total_break_time);

  //core logic of dividing events and breaks heuristically
  let breaks_finished = 0;
  let event_type = [];
  while (no_events) {
    let num = no_events / (breaks + 1 - breaks_finished);
    let num_ceil = Math.ceil(num);
    no_events -= num_ceil;
    while (num_ceil--) {
      event_type.push("E");
    }
    if (breaks_finished == breaks) break;
    event_type.push("B");
    breaks_finished++;
  }
  while (no_events--) {
    event_type.push("E");
  }
  return get_schedule(event_type, start_time, one_event_duration, total_break_time, breaks, output_format);
};

// console.log(create_schedule("08:00 AM", "05:00 PM", 10, 4, "json"));
