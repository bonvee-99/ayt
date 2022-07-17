CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE page (
  page_id UUID DEFAULT uuid_generate_v4(),
  page_start_time TIMESTAMP DEFAULT localtimestamp,
  PRIMARY KEY (page_id)
);

CREATE TABLE student (
  student_id SERIAL,
  student_name VARCHAR(255) NOT NULL,
  page_id UUID NOT NULL, 
  PRIMARY KEY (student_id),
  FOREIGN KEY (page_Id) REFERENCES page(page_id)
);

CREATE TABLE course (
  course_id SERIAL,
  course_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  start_time VARCHAR(4) NOT NULL,
  end_time VARCHAR(4) NOT NULL,
  day VARCHAR(2) NOT NULL,
  semester VARCHAR(1) NOT NULL,
  PRIMARY KEY (course_id)
);

CREATE TABLE student_course (
  student_id SERIAL NOT NULL,
  course_id SERIAL NOT NULL,
  FOREIGN KEY (student_id) REFERENCES student(student_id),
  FOREIGN KEY (course_id) REFERENCES course(course_id)
);

/*
page (1tomany) student (manytomany) course

NOTE: users are not unique in the sense that they need an email address...
theres no logging in 

*/

