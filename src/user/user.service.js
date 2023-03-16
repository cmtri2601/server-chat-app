const User = require("./user.model");

const UserService = {
  //get all users
  findAllUsers: (req, res) => {
    User.find()
      .exec()
      .then(users => res.status(200).send(users))
      .catch(err => {
        res.status(200).send("Error when find all users");
        console.log(err);
      });
  },
};

module.exports = UserService;
