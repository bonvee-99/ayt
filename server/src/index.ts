import { parseCal, CalendarItem } from "./utilities/cal-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import pool from "./db";
import express from "express";
const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(cors());

const port = 5000;

app.post("/", async (req, res) => {
  try {
    if (req.files) {
      // @ts-ignore
      let data: Array<CalendarItem> = parseCal(req.files.file.data.toString('utf-8'));

      const newPage = await pool.query("INSERT INTO page DEFAULT VALUES RETURNING *");

      let { owner } = req.body;
      owner = "ben";

      await Promise.all(data.map((calItem: CalendarItem) => {
        return pool.query("INSERT INTO calendar(page_id, owner, summary, location, start_time, end_time, day) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [
          newPage.rows[0].page_id, owner, calItem.summary, calItem.location, calItem.start, calItem.end, calItem.day
        ])
      }));

      return res.json(newPage.rows[0].page_id);
    } else {
      res.status(400).json("Error uploading file");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
})

app.get("/calendar/:calId", async (req, res) => {
  try {
    const { calId } = req.params;
    const getCal = await pool.query("SELECT * FROM calendar WHERE page_id = $1", [
      calId
    ])

    res.json(getCal.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})


app.post("calendar/:calId", async (req, res) => {
  try {
    if (req.files) {
      // @ts-ignore
      let data: Array<CalendarItem> = parseCal(req.files.file.data.toString('utf-8'));

      const { calId } = req.params;

      let { owner } = req.body;
      owner = "ben";

      await Promise.all(data.map((calItem: CalendarItem) => {
        return pool.query("INSERT INTO calendar(page_id, owner, location, start_time, end_time, day) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
          calId, owner, calItem.location, calItem.start, calItem.end, calItem.day
        ])
      }));

      res.sendStatus(200);
    } else {
      res.status(400).send("Error uploading file");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }

})

app.listen(port, () => {
  console.log(`Stared server on port: ${port}`);
});
