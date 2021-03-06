/*Devstackr. (2019, April 10). Building the API | NodeJS, Express and Mongoose—[3] Build a Task Manager w/ MEAN Stack. https://www.youtube.com/watch?v=P3R-8jj3S7U */
const { List } = require("./list.model");
const { Task } = require("./task.model");
const { User } = require("./user.model");
const { Role, db } = require("./role.model");
const { Bookings } = require("./booking.model");

db.Roles = ["user", "admin", "moderator"];

module.exports = {
  List,
  Task,
  User,
  Role,
  Bookings,
};
