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
- update model so that when page is deleted all of its corresponding users are as well... and also any courses attached to those users (only if those courses don't belong to any other users)

Client:
- show events by semester (toggle)
- better styling / responsiveness
- remove sat/sun from calendar (wastes space)
- find a better way to display events side by side
- issue: header not displaying properly - bug with react-big-calendar?






