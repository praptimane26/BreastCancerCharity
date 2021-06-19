/*Devstackr. (2019, April 10). Building the API | NodeJS, Express and Mongoose—[3] Build a Task Manager w/ MEAN Stack. https://www.youtube.com/watch?v=P3R-8jj3S7U */

const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");

const bodyParser = require("body-parser");

//Load in the mongoose models
const { List, Task, User, Bookings } = require("./db/models");

/*const { JsonWebTokenError } = require("jsonwebtoken");*/

const jwt = require("jsonwebtoken");

//MiddleWAre

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
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );
  next();
});

// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
  let token = req.header("x-access-token");

  //verify the JWT
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) {
      // if there was an error
      //JWT is invalid - Do not Authenticate
      res.status(401).send(err);
    } else {
      //JWT is valid
      req.user_id = decoded._id;
      next();
    }
  });
};

//Verify REfresh Token Middleware which will be verifying the session
let verifySession = (req, res, next) => {
  //grabthe request token from the header
  let refreshToken = req.header("x-refresh-token");

  //grab the _id from the request handler
  let _id = req.header("_id");

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        //user cant be found
        return Promise.reject({
          error:
            "User not found. Make sure the refresh token and the user id are correct",
        });
      }

      //if the code reaches here the user was found
      // the refesh token exists in the database check if it's expired or not

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
        if (session.token == refreshToken) {
          //check if the session has expired
          if (User.hasRefreshTokenExpired(session.expiresAt) == false) {
            // refresh token has not expired
            isSessionValid = true;
          }
        }
      });

      if (isSessionValid) {
        // the session is valid call Next to process this web request
        next();
      } else {
        //the session is not valid
        return Promise.reject({
          error: "Refresh token has expired or the session is invalid",
        });
      }
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

// End Middleware

//Route Handlers

//List Routes

//GET/lists (Purpose to get all lists)
app.get("/lists", authenticate, (req, res) => {
  //we want to return an array of all the lists in the database that belongs to the authenticated user
  List.find({
    _userId: req.user_id,
  }).then((lists) => {
    res.send(lists);
  });
});

app.post("/bookings", authenticate, (req, res) => {
  console.log(req);

  let name = req.body.payload.name;
  let email = req.body.payload.email;
  let subject = req.body.payload.subject;
  let message = req.body.payload.message;
  //  let booking = new Bookings({
  //    name = req.body.payload.name,
  //    email = req.body.payload.email,
  //    subject = req.body.payload.subject,
  //    message = req.body.payload.message,
  //    _userId: req.user_id,
  //  })

  let booking = new Bookings({
    name,
    email,
    subject,
    message,
    _userId: req.user_id,
  });

  booking.save().then((bookingList) => {
    //the full list document is returned (including ID)
    res.send(bookingList);
  });
});

//POST/lists (Purpose to create a list)
app.post("/lists", authenticate, (req, res) => {
  console.log("adding a list");
  //we want to create a new list and return the new lst document back to user which includes the new id
  //the list information will be passed on by the JSON request body
  let title = req.body.title;

  let newList = new List({
    title,
    _userId: req.user_id,
  });
  newList.save().then((listDoc) => {
    //the full list document is returned (including ID)
    res.send(listDoc);
  });
});

//PATCH/lists/:id (Purpose to update the specfied list )

app.patch("/lists/:id", authenticate, (req, res) => {
  // we want to update the specified list (list document with id in the url) with the new values specified in the JSON body request
  List.findOneAndUpdate(
    { _id: req.params.id, _userId: req.user_id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus({ message: "updated successfully" });
  });
});

//DELETE/lists/:id (Purpose to delete the specified list)
app.delete("/lists/:id", authenticate, (req, res) => {
  //we want to delete the specified list (list document with id in the url) with the new values specified in the JSON body request
  List.findOneAndRemove({
    _id: req.params.id,
    _userId: req.user_id,
  }).then((removedListDoc) => {
    res.send(removedListDoc);

    // delete all the tasks that are in the deleted list

    deleteTasksFromList(removedListDoc._id);
  });
});

//GET /lists/:listId/tasks
//Purpose to get the task for the specific list
app.get("/lists/:listId/tasks", authenticate, (req, res) => {
  //We want to return all task that belong to a specific list (specified by listID)
  Task.find({
    _listId: req.params.listId,
  }).then((tasks) => {
    res.send(tasks);
  });
});

//POST /lists/:listId/tasks
//Purpose to create the new task for the specific list
app.post("/lists/:listId/tasks", authenticate, (req, res) => {
  //we want to create a new task in the specified by listId

  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        //list object is with the specified condition was found
        //therefore the currently authenticated user can create new tasks
        return true;
      }

      //else the list object is undefined
      return false;
    })
    .then((canCreateTask) => {
      if (canCreateTask) {
        let newTask = new Task({
          title: req.body.title,
          _listId: req.params.listId,
        });
        newTask.save().then((newTaskDoc) => {
          res.send(newTaskDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
});
/*
//PATCH /lists/:listId/tasks/:taskId
//Purpose to update task for the specific list with the taskId
*/
app.patch("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
  //We want to update an existing task specified by taskId

  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        //list object is with the specified conditions was found
        //therefore the currently authenticated user can update the tasks in this list
        return true;
      }

      //else the list object is undefined
      return false;
    })
    .then((canUpdateTasks) => {
      if (canUpdateTasks) {
        // the currently authenticated user can update tasks

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
      } else {
        res.sendStatus(404);
      }
    });
});

/*
//DELETE /lists/:listId/tasks/:taskId
//Purpose to delete task for the specific list with the taskId
*/
app.delete("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        //list object is with the specified conditions was found
        //therefore the currently authenticated user can update the tasks in this list
        return true;
      }

      //else the list object is undefined
      return false;
    })
    .then((canDeleteTasks) => {
      if (canDeleteTasks) {
        Task.findOneAndRemove({
          _id: req.params.taskId,
          _listId: req.params.listId,
        }).then((removeTaskDoc) => {
          res.send(removeTaskDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });

  //We want to delete an existing task specified by taskId
});

//User Routes

//POST/users (Purpose Sign Up)

app.post("/users", (req, res) => {
  //user sign up

  let body = req.body;
  let newUser = new User(body);

  console.log("received sign up");

  console.log(body);

  newUser
    .save()
    .then(() => {
      console.log("save then");
      return newUser.createSession();
    })
    .then((refreshToken) => {
      // Session created successfully - refreshToken returned
      // now we can generate an access authorization token for the user

      console.log("refreshed token done");

      return newUser.generateAccessAuthToken().then((accessToken) => {
        //access authorization generation was successful and we can now return the object containing the auth tokens
        console.log("Got the token back from the user");
        return { accessToken, refreshToken };
      });
    })
    .then((authTokens) => {
      console.log(newUser);
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

//GET/users/me/access-token
//its purpose it to generate and return access tokens

app.get("/users/me/access-token", verifySession, (req, res) => {
  // the user caller is authenticated and we have the user id and user object available for us
  req.userObject
    .generateAccessAuthToken()
    .then((accessToken) => {
      res.header("x-access-token", accessToken).send({ accessToken });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

//Helper Methods
let deleteTasksFromList = (_listId) => {
  Task.deleteMany({
    _listId,
  }).then(() => {
    console.log("Tasks from" + _listId + " were deleted!");
  });
};

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
