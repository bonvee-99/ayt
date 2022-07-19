import type { NextPage } from 'next'
import styles from '../../styles/Home.module.css'
import { useState, useEffect } from "react"
import { FileUploader } from "react-drag-drop-files"
import BigCalendar from "../../components/BigCalendar"
import Users from "../../components/Users"
import Router from "next/router"


const fileTypes = ["ICS",]

const url = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
// const pageUrl = process.env.VERCEL_URL || "http://localhost:3000";

const COLORS = ["blue", "green", "red", "orange", "pink", "yellow", "grey", "brown", "cyan", "magenta", "black", "purple", "lime"];

const Calendar: NextPage = ({ calid }: any) => {
  const [file, setFile] = useState(null)
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])

  const handleChange = (file: any) => {
    setFile(file);
  }

  const addCal = async () => {
    try {
      const data = new FormData();
      if (file) {
        data.append("file", file);
        await fetch(`${url}/calendar/${calid}`, {
          method: "POST",
          body: data
        })
        Router.reload();
      }
    } catch (error) {
      console.error(error)
    }
  }

  const toggleUser = (toggledUser: any) => {
    setUsers(
      users.map((user: any) => {
        return user.id === toggledUser.id ? { ...user, display: !user.display } : user;
      }) as Array<never>)
    setEvents(
      events.map((e: any) => {
        return e.student_id === toggledUser.id ? { ...e, display: !e.display } : e;
      }) as Array<never>)
  }

  const getDate = (d: any) => {
    let date: any = {}
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

  useEffect(() => {
    (async () => {
      const response = await fetch(`${url}/calendar/${calid}`)
      const cal = await response.json()

      const seenusers: any = {};
      let color = -1
      const evts = cal.map((e: any) => {
        if (!Object.keys(seenusers).includes(e.student_id.toString())) {
          color++
          if (color >= COLORS.length) {
            color = 0
          }
          seenusers[e.student_id] = COLORS[color]
        }
        let date = getDate(e)
        return {
          title: e.course_name + `: ${e.student_name}`,
          start: new Date(date.year, date.month, date.day, e.start_time.slice(0, 2), e.end_time.toString().slice(2, 4)),
          end: new Date(date.year, date.month, date.day, e.end_time.slice(0, 2), e.end_time.toString().slice(2, 4)),
          color: seenusers[e.student_id],
          student_id: e.student_id,
          display: true
        }
      })
      setEvents(evts)
      
      let u: any = []
      cal.forEach((e: any) => {
        if (!u.some((user: any) => user.id === e.student_id)) {
          u.push({ name: e.student_name, id: e.student_id, display: true, color: seenusers[e.student_id] })
        }
      })
      setUsers(u)
    })()
  }, [])

  return (
    <>
      <h1>{`${pageUrl}/calendar/${calid}`}</h1>
      <div className={styles.headerctn}>
        <div className={styles.dragndrop}>
          <h1>Hello To Drag & Drop Files</h1>
          <FileUploader
            multiple={false}
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          />
          <p>{file ? `Received file: ${(file as any).name}` : "no files uploaded yet"}</p>
          <button onClick={addCal}>Add My Calendar</button>
        </div>
        {users.length > 0 && <Users userList={users} toggleUser={toggleUser} />}
      </div>
      {events.length > 0 && <BigCalendar events={events.filter((e: any) => e.display)} />}
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { calid } = context.params;

  return {
    props: {
      calid
    }
  }
}

export default Calendar
