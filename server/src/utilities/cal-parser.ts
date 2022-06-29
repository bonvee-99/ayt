import * as ical2json from "ical2json";

interface CalendarItem {
  summary: string,
  location: string,
  start: string,
  end: string,
  day: string,
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
  const summary: string = c.SUMMARY;
  const location: string = c.LOCATION.replace("\\", "");
  const start: string = c["DTSTART;TZID=America/Vancouver"].split("T")[1].slice(0, 4);
  const end: string = c["DTEND;TZID=America/Vancouver"].split("T")[1].slice(0, 4);
  const day: string = c.RRULE.split("BYDAY=")[1];
  return {
    summary,
    location,
    start,
    end,
    day
  }
}

export {
  parseCal,
  CalendarItem,
}


