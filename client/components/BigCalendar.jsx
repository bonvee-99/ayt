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


const BigCalendar = ({events}) => {
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
        events={events}
        style={{ height: "1000px", width: "1500px", margin: "auto", marginTop: "100px", padding: 0 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  )
}


export default BigCalendar
