import { parseCal, CalendarItem } from "./utilities/cal-parser";
import fileUpload from "express-fileupload";
import pool from "./db";
import express from "express";
const app = express();

app.use(express.json());
app.use(fileUpload());

const port = 3000;

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", async (req, res) => {
  try {
    if (req.files) {
      // @ts-ignore
      let data: Array<CalendarItem> = parseCal(req.files.file.data.toString('utf-8'));

      const newPage = await pool.query("INSERT INTO page DEFAULT VALUES RETURNING *");

      let { owner } = req.body;
      owner = "ben";

      await Promise.all(data.map((calItem: CalendarItem) => {
        return pool.query("INSERT INTO calendar(page_id, owner, location, start_time, end_time, day) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
          newPage.rows[0].page_id, owner, calItem.location, calItem.start, calItem.end, calItem.day
        ])
      }));

      // create url with uuid
      let url: string = process.env.NODE_ENV === "PRODUCTION" ? 'url' : `http:localhost:${port}/${newPage.rows[0].page_id}`;
      return res.send(url);
    } else {
      res.status(400).send("Error uploading file");
    }
    // const newPage = await pool.query("INSERT INTO page DEFAULT VALUES RETURNING *");
    // console.log(ical);
    // res.send(newPage.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
})

app.get("/:calid", async (req, res) => {
  try {
    const { calid } = req.params;
    const getCal = await pool.query("SELECT * FROM calendar WHERE page_id = $1", [
      calid
    ])
    res.send(getCal.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

app.post("/:calid", async (req, res) => {

})

app.put("/:calid", async (req, res) => {

})

app.delete("/:calid", async (req, res) => {

})

// react filepond

app.listen(port, () => {
  console.log(`Stared server on port: ${port}`);
});
