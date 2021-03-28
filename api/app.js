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

//GET /lists/:listId/tasks
//Purpose to get the task for the specific list
app.get("/lists/:listId/tasks", (req, res) => {
  //We want to return all task that belong to a specific list (specified by listID)
  Task.find({
    _listId: req.params.listId,
  }).then((tasks) => {
    res.send(tasks);
  });
});

//POST /lists/:listId/tasks
//Purpose to create the new task for the specific list
app.post("/lists/:listId/tasks", (req, res) => {
  //we want to create a new task in the specified by listId
  let newTask = new Task({
    title: req.body.title,
    _listId: req.params.listId,
  });
  newTask.save().then((newTaskDoc) => {
    res.send(newTaskDoc);
  });
});
/*
//PATCH /lists/:listId/tasks/:taskId
//Purpose to update task for the specific list with the taskId
*/
app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  //We want to update an existing task specified by taskId
  Task.findOneAndUpdate(
    {
      _id: req.params.taskId,
      _listId: req.params.listId,
    },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

/*
//DELETE /lists/:listId/tasks/:taskId
//Purpose to delete task for the specific list with the taskId
*/
app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
  //We want to delete an existing task specified by taskId
  Task.findOneAndRemove({
    _id: req.params.taskId,
    _listId: req.params.listId,
  }).then((removeTaskDoc) => {
    res.send(removeTaskDoc);
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
