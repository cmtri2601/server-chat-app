const mongoose = require("../database");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: Array,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
