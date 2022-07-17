import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo } from "react"

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const COLORS = ["blue", "green", "red", "orange", "pink", "yellow", "grey", "brown", "cyan", "magenta", "black", "purple", "lime"];

const BigCalendar = (props) => {
  const getDate = (d) => {
    let date = {}
    let day
    if (d.day === "MO") {
      day = 3
    } else if (d.day === "TU") {
      day = 4
    } else if (d.day === "WE") {
      day = 5
    } else if (d.day === "TH") {
      day = 6
    } else if (d.day === "FR") {
      day = 7
    }
    date.year = 2022
    date.month = 0
    date.day = day
    return date
  }

  const formatCalendar = (e) => {
    const seenusers = {};
    let color = -1;
    const studentCourses = e.map(studentCourse => {
      if (!Object.keys(seenusers).includes(`${studentCourse.student_id}`)) {
        color = color + 1;
        seenusers[studentCourse.student_id] = COLORS[color];
      }
      let date = getDate(studentCourse)
      return {
        title: studentCourse.course_name + `: ${studentCourse.student_name}`,
        start: new Date(date.year, date.month, date.day, studentCourse.start_time.slice(0, 2), studentCourse.end_time.toString().slice(2, 4)),
        end: new Date(date.year, date.month, date.day, studentCourse.end_time.slice(0, 2), studentCourse.end_time.toString().slice(2, 4)),
        color: seenusers[studentCourse.student_id]
      }
    })
    return studentCourses;
  }

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color,
      color: "white",
      opacity: 1,
    };
    return {
      style: style,
    };
  }

  const formats = useMemo(() => ({
    daTeFomat: "dd",
    dayFormat: (date, culture, localizer) => {
      return localizer.format(date, "ddd", culture)
    }
  }), [])

  return (
    <div>
      <Calendar
        localizer={localizer}
        // formats={formats}
        views={["week"]}
        defaultView={Views.WEEK}
        defaultDate={new Date(2022, 0, 2)}
        min={new Date(2022, 0, 2, 7)}
        max={new Date(2022, 0, 2, 22)}
        toolbar={false}
        startAccessor="start"
        endAccessor="end"
        events={formatCalendar(props.cal)}
        style={{ height: "1000px", width: "1500px", margin: 0, padding: 0 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  )
}


export default BigCalendar
