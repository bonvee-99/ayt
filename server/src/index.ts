// @ts-ignore
import { cal }from "./text";
import { parseCal, Calendar } from "./utilities/cal-parser"; 
import express from "express";
const app = express();

const port = 3000;


app.get("/", async (_req, res) => {
  try {
    console.log(cal);
    var data: Calendar = parseCal(cal);
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
})

app.listen(port, () => {
  console.log(`Stared server on port: ${port}`);
});
