/*Devstackr. (2019, April 10). Building the API | NodeJS, Express and Mongoose—[3] Build a Task Manager w/ MEAN Stack. https://www.youtube.com/watch?v=P3R-8jj3S7U */

const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");

const bodyParser = require("body-parser");

//Load in the mongoose models
const { List, Task, User } = require("./db/models");
/*const { User } = require("./db/models/user.model");*/

//Load Middleware
app.use(bodyParser.json());

//CORS Headers Middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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
    res.send({ message: "Updated Successfully." });
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

//User Routes

//POST/users (Purpose Sign Up)

app.post("/users", (req, res) => {
  //user sign up

  let body = req.body;
  let newUser = new User(body);

  newUser
    .save()
    .then(() => {
      return newUser.createSession();
    })
    .then((refreshToken) => {
      // Session created successfully - refreshToken returned
      // now we can generate an access authorization token for the user

      return newUser.generateAccessAuthToken().then((accessToken) => {
        //access authorization generation was successful and we can now return the object containing the auth tokens
        return { accessToken, refreshToken };
      });
    })
    .then((authTokens) => {
      res
        .header("x-refresh-token", authTokens.refreshToken)
        .header("x-access-token", authTokens.accessToken)
        .send(newUser);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

//POST/users/login (Purpose Login)

app.post("/users/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password)
    .then((user) => {
      return user
        .createSession()
        .then((refreshToken) => {
          // Session created successfully - refreshToken returned.
          // now we geneate an access auth token for the user

          return user.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken };
          });
        })
        .then((authTokens) => {
          // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
          res
            .header("x-refresh-token", authTokens.refreshToken)
            .header("x-access-token", authTokens.accessToken)
            .send(user);
        });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
