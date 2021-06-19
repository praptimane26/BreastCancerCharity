exports.allAccess = (req, res) => {
  res
    .status(200)
    .send("<h3>This is a heading.</h3> <p>This is a paragrdsacaph.</p>");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
