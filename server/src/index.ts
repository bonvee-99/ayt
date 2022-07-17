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
          "SELECT course_id FROM course WHERE course_name = $1 AND location = $2 AND start_time = $3 AND end_time = $4 AND day = $5 AND semester = $6",
          [calItem.course_name, calItem.location, calItem.start_time, calItem.end_time, calItem.day, calItem.semester]
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
          "INSERT INTO course(course_name, location, start_time, end_time, day, semester) VALUES ($1, $2, $3, $4, $5, $6) RETURNING course_id",
          [calItem.course_name, calItem.location, calItem.start_time, calItem.end_time, calItem.day, calItem.semester]
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
        "INSERT INTO student (student_name, page_id) VALUES ($1, $2) returning student_id",
        [name, newPage.rows[0].page_id]
      )

      // add course links with student
      await Promise.all(courseIds.map((id: number) => {
        return pool.query(
          "INSERT INTO student_course(student_id, course_id) VALUES ($1, $2)",
          [student.rows[0].student_id, id]
        )
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

// gets all calendars with given page id
app.get("/calendar/:pageId", async (req, res) => {
  try {
    // based on page id... get users... then get all their courses
    const { pageId } = req.params;
    const getCal = await pool.query("SELECT s.student_name, s.student_id, c.course_name, c.day, c.location, c.start_time, c.end_time, c.semester FROM student AS s INNER JOIN student_course AS sc ON s.student_id = sc.student_id INNER JOIN course as c ON c.course_id = sc.course_id WHERE s.page_id = $1", [
      pageId
    ])

    res.json(getCal.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

// add a user calendar to an existing page
app.post("/calendar/:pageId", async (req, res) => {
  try {
    if (req.files) {
      // @ts-ignore
      let data: Array<CalendarItem> = parseCal(req.files.file.data.toString('utf-8'));

      // check if any of these courses already exist in database
      const findCourses = await Promise.all(data.map((calItem: CalendarItem) => {
        return pool.query(
          "SELECT course_id FROM course WHERE course_name = $1 AND location = $2 AND start_time = $3 AND end_time = $4 AND day = $5 AND semester = $6",
          [calItem.course_name, calItem.location, calItem.start_time, calItem.end_time, calItem.day, calItem.semester]
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
          "INSERT INTO course(course_name, location, start_time, end_time, day, semester) VALUES ($1, $2, $3, $4, $5, $6) RETURNING course_id",
          [calItem.course_name, calItem.location, calItem.start_time, calItem.end_time, calItem.day, calItem.semester]
        )
      }));

      // add new course ids
      for (let i = 0; i < addedCourses.length; i++) {
        courseIds.push(addedCourses[i].rows[0].course_id);
      }

      // TODO: handle user from client (just like this for easier testing right now)
      let { name } = req.body;
      name = "caleb";

      const { pageId } = req.params;


      // create user
      const student = await pool.query(
        "INSERT INTO student (student_name, page_id) VALUES ($1, $2) returning student_id",
        [name, pageId]
      )

      // add course links with student
      await Promise.all(courseIds.map((id: number) => {
        return pool.query(
          "INSERT INTO student_course(student_id, course_id) VALUES ($1, $2)",
          [student.rows[0].student_id, id]
        )
      }));

      return res.sendStatus(200);
    } else {
      res.status(400).json("Error uploading file");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
})

app.listen(port, () => {
  console.log(`Stared server on port: ${port}`);
});
