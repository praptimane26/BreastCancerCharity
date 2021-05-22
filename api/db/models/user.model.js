const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
/*const { resolve } = require("path");*/

//JWT Secrets
const jwtSecret = "72432293410771688139breastcancerawareness2167635028";
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  sessions: [
    {
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Number,
        required: true,
      },
    },
  ],
});

//Instance Methods

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  //returning document except for sessions and passwords (not to be made public)

  return _.omit(userObject, ["password", "sessions"]);
};

UserSchema.methods.generateAccessAuthToken = function () {
  const user = this;
  return new Promise((resolve, reject) => {
    //Create JSON web token and return it
    jwt.sign(
      { _id: user._id.toHexString() },
      jwtSecret,
      { expiresIn: "15m" },
      (err, token) => {
        if (!err) {
          resolve(token);
        } else {
          //when there is an error
          reject();
        }
      }
    );
  });
};

UserSchema.methods.generateRefreshAuthToken = function () {
  //this method generate a random 64byte hex string - it won't save it to the database but the saveSessionToDatabase() does that
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (!err) {
        //no error
        let token = buf.toString("hex");

        return resolve(token);
      }
    });
  });
};

UserSchema.methods.createSession = function () {
  let user = this;

  return user
    .generateRefreshAuthToken()
    .then((refreshToken) => {
      return saveSessionToDatabase(user, refreshToken);
    })
    .then((refreshToken) => {
      // saved to database successfully
      // now return the refesh token
      return refreshToken;
    })
    .catch((e) => {
      return Promise.reject(
        "Failed to save the session to the Database.\n" + e
      );
    });
};

//Module MEthods (Static - these can be called on a model and not an instance of a model)
UserSchema.statics.findByIdAndToken = function (_id, token) {
  // finds the user by id and the token
  // used in auth middleware - verifySession

  const User = this;

  return User.findOne({
    _id,
    "sessions.token": token,
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  return User.findOne({ email }).then((user) => {
    if (!user) return Promise.reject();

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) resolve(user);
        else {
          reject();
        }
      });
    });
  });
};

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let secondsSinceEpoch = Date.now() / 1000;
  if (expiresAt > secondsSinceEpoch) {
    //hasnt expired
    return false;
  } else {
    // has expired
    return true;
  }
};

// Middleware
// Before the user document is saved this code runs
UserSchema.pre("save", function (next) {
  let user = this;
  let costFactor = 10;

  if (user.isModified("password")) {
    // if password is changed/edited run this code

    //Generate Salt and hash the password
    bcrypt.genSalt(costFactor, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//Helper Methods
let saveSessionToDatabase = (user, refreshToken) => {
  //save session to dtaabase
  return new Promise((resolve, reject) => {
    let expiresAt = generateRefreshTokenExpireTime();

    user.sessions.push({ token: refreshToken, expiresAt });

    user
      .save()
      .then(() => {
        // saved the session successfully
        return resolve(refreshToken);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

let generateRefreshTokenExpireTime = () => {
  let daysUntilExpire = "10";
  let secondsUntilExpire = daysUntilExpire * 24 * 60 * 60;
  return Date.now() / 1000 + secondsUntilExpire;
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
