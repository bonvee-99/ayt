import type { NextPage } from 'next'
import styles from '../../styles/Home.module.css'
import { useState } from "react"
import { FileUploader } from "react-drag-drop-files"

const fileTypes = ["ICS",]

const Calendar: NextPage = (props: any) => {
  console.log(props.calendar);
  const [file, setFile] = useState(null);

  const handleChange = (file: any) => {
    setFile(file);
  }

  const addCal = async () => {
    try {
      const data = new FormData();
      if (file) {
        data.append("file", file);
        const response = await fetch(`http://localhost:5000/calendar/${props.calid}`, {
          method: "POST",
          body: data
        })
        const parseResponse = await response.json();
        console.log(parseResponse);
      }
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <>
      <h1>Calendar!: {props.calid}</h1>
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
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { calid } = context.params;
  const response = await fetch(`http://localhost:5000/calendar/${calid}`)
  const calendar = await response.json();

  return {
    props: {
      calendar,
      calid
    }
  }
}

export default Calendar
