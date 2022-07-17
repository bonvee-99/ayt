import type { NextPage } from 'next'
import styles from '../../styles/Home.module.css'
import { useState } from "react"
import { FileUploader } from "react-drag-drop-files"
import BigCalendar from "../../components/BigCalendar"
import Router from "next/router"

const fileTypes = ["ICS",]

const url = process.env.SERVER_URL || "http://localhost:5000";
const pageUrl = process.env.PAGE_URL || "http://localhost:3000";

const Calendar: NextPage = (props: any) => {
  const [file, setFile] = useState(null);

  const handleChange = (file: any) => {
    setFile(file);
  }

  const addCal = async () => {
    try {
      const data = new FormData();
      if (file) {
        data.append("file", file);
        await fetch(`${url}/calendar/${props.calid}`, {
          method: "POST",
          body: data
        })
        Router.reload();
      }
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <>
    <h1>{`${pageUrl}/calendar/${props.calid}`}</h1>
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
        <BigCalendar cal={props.calendar} />
      </div>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { calid } = context.params;
  const response = await fetch(`${url}/calendar/${calid}`)
  const calendar = await response.json();

  return {
    props: {
      calendar,
      calid
    }
  }
}

export default Calendar
