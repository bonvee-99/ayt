import { NextPage } from "next"

const Calendar: NextPage = (props: any) => {
console.log(props.calendar[0])
  return (
    <div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const {calid} = context.params;
  const response = await fetch(`http://localhost:5000/calendar/${calid}`)
  const calendar = await response.json();

  return {
    props: {
      calendar,
    }
  }
}

export default Calendar
