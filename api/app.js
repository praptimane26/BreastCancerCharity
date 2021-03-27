const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");

const bodyParser = require("body-parser");

//Load in the mongoose models
const { List, Task } = require("./db/models");

//Load Middleware
app.use(bodyParser.json());

//Route Handlers

//List Routes

//GET/lists (Purpose to get all lists)
app.get("/lists", (req, res) => {
  //we want to return an array of all the lists in the database
  List.find({}).then((lists) => {
    res.send(lists);
  });
});

//POST/lists (Purpose to create a list)
app.post("/lists", (req, res) => {
  //we want to create a new list and return the new lst document back to user which includes the new id
  //the list information will be passed on by the JSON request body
  let title = req.body.title;

  let newList = new List({
    title,
  });
  newList.save().then((listDoc) => {
    //the full list document is returned (including ID)
    res.send(listDoc);
  });
});

//PATCH/lists/:id (Purpose to update the specfied list )
app.patch("/lists/:id", (req, res) => {
  // we want to update the specified list (list document with id in the url) with the new values specified in the JSON body request
  List.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

//DELETE/lists/:id (Purpose to delete the specified list)
app.delete("/lists/:id", (req, res) => {
  //we want to delete the specified list (list document with id in the url) with the new values specified in the JSON body request
  List.findOneAndRemove({
    _id: req.params.id,
  }).then((removedListDoc) => {
    res.send(removedListDoc);
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
