/*Devstackr. (2019, April 10). Building the API | NodeJS, Express and Mongoose—[3] Build a Task Manager w/ MEAN Stack. https://www.youtube.com/watch?v=P3R-8jj3S7U */
const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },

  //with auth
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const List = mongoose.model("List", ListSchema);

module.exports = { List };
