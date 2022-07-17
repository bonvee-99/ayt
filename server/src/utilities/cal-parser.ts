import * as ical2json from "ical2json";

interface CalendarItem {
  course_name: string,
  location: string,
  start_time: string,
  end_time: string,
  day: string,
  semester: string 
}

function parseCal(cal: string): Array<CalendarItem> {
  const data = ical2json.convert(cal).VCALENDAR[0].VEVENT;
  let calendar: Array<CalendarItem> = [];
  for (let i = 0; i < data.length; i++) {
    const c: CalendarItem = formatCalClass(data[i]);
    calendar.push(c);
  }
  return calendar;
}

function formatCalClass(c: any): CalendarItem {
  const course_name: string = c.SUMMARY;
  const location: string = c.LOCATION.replace("\\", "");
  const start_time: string = c["DTSTART;TZID=America/Vancouver"].split("T")[1].slice(0, 4);
  const end_time: string = c["DTEND;TZID=America/Vancouver"].split("T")[1].slice(0, 4);
  const day: string = c.RRULE.split("BYDAY=")[1];
  const startDate: string = c["DTSTART;TZID=America/Vancouver"].slice(4, 6)
  const semester: string = startDate === "09" || startDate === "05" ? "0" : "1";
  return {
    course_name,
    location,
    start_time,
    end_time,
    day,
    semester
  }
}

export {
  parseCal,
  CalendarItem,
}


