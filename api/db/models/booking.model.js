/*Devstackr. (2019, April 10). Building the API | NodeJS, Express and Mongoose—[3] Build a Task Manager w/ MEAN Stack. https://www.youtube.com/watch?v=P3R-8jj3S7U */
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  name: {
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

const Bookings = mongoose.model("Bookings", BookingSchema);

module.exports = { Bookings };