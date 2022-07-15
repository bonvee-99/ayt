# SETUP
- make a local psql database based on .env.example

### Backend
- cd server
- npm install
- npm run dev

### Client
- cd client
- npm install
- npm run dev

- upload calendar file

### Todo:
Backend:
- route to get a page's calendars (JOINS?)
- route to upload a calendar to an existing page
- update model so that when page is deleted all of its corresponding users are as well... and also any courses attached to those users (only if those courses don't belong to any other users)
Client:
- display calendar link based on a given page






