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

// client sends a calendar. Parses .ical file to json and uploads to database
// see database.sql for model
app.post("/", async (req, res) => {
  try {
    if (req.files) {
      // @ts-ignore
      let data: Array<CalendarItem> = parseCal(req.files.file.data.toString('utf-8'));

      const newPage = await pool.query("INSERT INTO page DEFAULT VALUES RETURNING *");

      // check if any of these courses already exist in database
      const findCourses = await Promise.all(data.map((calItem: CalendarItem) => {
        return pool.query(
          "SELECT course_id FROM course WHERE name = $1 AND location = $2 AND start_time = $3 AND end_time = $4 AND day = $5",
          [calItem.name, calItem.location, calItem.start_time, calItem.end_time, calItem.day]
        )
      }));

      let missingCourses: Array<CalendarItem> = [];
      let courseIds: Array<number> = [];
      for (let i: number = 0; i < data.length; i++) {
        // course is missing
        if (findCourses[i].rows.length === 0) {
          missingCourses.push(data[i]);
          data.splice(i, 1);
          i--;
        } else {
          // duplicate course so just get its id
          courseIds.push(findCourses[i].rows[0].course_id);
          findCourses.splice(i, 1);
          data.splice(i, 1);
          i--;
        }
      }

      // add missing courses
      const addedCourses = await Promise.all(missingCourses.map((calItem: CalendarItem) => {
        return pool.query(
          "INSERT INTO course(name, location, start_time, end_time, day) VALUES ($1, $2, $3, $4, $5) RETURNING course_id",
          [calItem.name, calItem.location, calItem.start_time, calItem.end_time, calItem.day]
        )
      }));

      // add new course ids
      for (let i = 0; i < addedCourses.length; i++) {
        courseIds.push(addedCourses[i].rows[0].course_id);
      }

      // TODO: handle user from client (just like this for easier testing right now)
      let { name } = req.body;
      name = "ben";

      // create user
      const student = await pool.query(
        "INSERT INTO student (name, page_id) VALUES ($1, $2) returning student_id",
        [name, newPage.rows[0].page_id]
      )

      // add course links with student
      await Promise.all(courseIds.map((id: number) => {
        return pool.query(
          "INSERT INTO student_course(student_id, course_id) VALUES ($1, $2)",
          [student.rows[0].student_id, id]
        )
      }));
      console.log(newPage.rows[0]);

      return res.json(newPage.rows[0].page_id);
    } else {
      res.status(400).json("Error uploading file");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
})

// gets all calendars with given page id
app.get("/calendar/:calId", async (req, res) => {
  try {
    // based on page id... get users... then get all their courses
    const { calId } = req.params;
    console.log(calId);
    const getCal = await pool.query("SELECT * FROM calendar WHERE page_id = $1", [
      calId
    ])

    res.json(getCal.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

// // adds a calendar from client to an existing page
// // TODO: first check if that user exists
// app.post("calendar/:calId", async (req, res) => {
//   try {
//     if (req.files) {
//       // @ts-ignore
//       let data: Array<CalendarItem> = parseCal(req.files.file.data.toString('utf-8'));

//       const { calId } = req.params;

//       let { owner } = req.body;
//       owner = "ben";

//       await Promise.all(data.map((calItem: CalendarItem) => {
//         return pool.query("INSERT INTO calendar(page_id, owner, location, start_time, end_time, day) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
//           calId, owner, calItem.location, calItem.start, calItem.end, calItem.day
//         ])
//       }));

//       res.sendStatus(200);
//     } else {
//       res.status(400).send("Error uploading file");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }

// })

app.listen(port, () => {
  console.log(`Stared server on port: ${port}`);
});
