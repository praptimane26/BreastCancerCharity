# BreastCancerCharity

# Angular App
to start the front end - "ng serve" runs on localhost4200
to run the backend "nodemon app.js" or npm start will work too as long as you're in the api folder runs on localhost3000

# VueJs App
to start the VueBreastCancer which is the front end - npm run serve runs on localhost 8081
to start the VueBreastCancerBackend which is the backend - node server.js runs on localost 8080

This is an API fr the first phase which is the Task Manager "Once in the front end with backend running please click on the "Howdy List" to see how the task does get added"

Post Man Steps to check the Lists

GET = localhost:3000/lists
POST = localhost:3000/lists
DELETE = localhost:3000/lists/605f3b851ca9692a08205404
PATCH = localhost:3000/lists/605f3b851ca9692a08205404 (result should be OK)


Post Man Steps to check the Tasks (HOWDY in List)

POST = localhost:3000/lists/6060236fa956983e30fb63a0/tasks
GET = localhost:3000/lists/605ffb20ba2f3e1ec0baad83/tasks
PATCH = localhost:3000/lists/605ffb20ba2f3e1ec0baad83/tasks/605ffbc5e735af6a28922318 (result should be OK)
DELETE = localhost:3000/lists/605ffb20ba2f3e1ec0baad83/tasks/605ffbc5e735af6a28922318
