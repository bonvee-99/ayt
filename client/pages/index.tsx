import type { NextPage } from 'next'
// import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from "react"
import { FileUploader } from "react-drag-drop-files"

const fileTypes = ["ICS",]

const Home: NextPage = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);

  const handleChange = (file: any) => {
    setFile(file);
  }

  const createPage = async () => {
    const data = new FormData();
    if (file) {
      data.append("file", file);
      const response = await fetch("http://localhost:5000", {
        method: "POST",
        body: data
      })
      const parseResponse = await response.json();
      console.log(parseResponse);
      // TODO: parseResponse is query paramater for new url to get!
      // redirect to new calendar page... also show url?
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
