const express = require("express");
const app = express();

//Route Handlers

//List Routes

//GET/lists (Purpose to get all lists)
app.get("/lists", (req, res) => {
  //we want to return an array of all the lists in the database
});

//POST/lists (Purpose to create a list)
app.post("/lists", (req, res) => {
  //we want to create a new list and return the new lst document back to user which includes the new id
  //the list information will be passed on by the JSON request body
});

//PATCH/lists/:id (Purpose to update the specfied list )
app.patch("/:id", (req, res) => {
  // we want to update the specified list (list document with id in the url) with the new values specified in the JSON body request
});

//DELETE/lists/:id (Purpose to delete the specified list)
app.delete("/id", (req, res) => {
  //we want to delete the specified list (list document with id in the url) with the new values specified in the JSON body request
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
