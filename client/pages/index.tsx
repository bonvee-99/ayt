import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useState } from "react"
import { FileUploader } from "react-drag-drop-files"
import { useRouter } from "next/router"

const fileTypes = ["ICS",]

const Home: NextPage = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);

  const handleChange = (file: any) => {
    setFile(file);
  }

  const createPage = async () => {
    try {
      const data = new FormData();
      if (file) {
        data.append("file", file);
        const response = await fetch("http://localhost:5000", {
          method: "POST",
          body: data
        })
        const parseResponse = await response.json();
        router.push(`/calendar/${parseResponse}`)
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.dragndrop}>
      <h1>Hello To Drag & Drop Files</h1>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
      <p>{file ? `Received file: ${(file as any).name}` : "no files uploaded yet"}</p>
      <button onClick={createPage}>Create Calendar Page</button>
    </div>
  )
}

export default Home
