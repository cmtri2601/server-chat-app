const express = require("express");
const router = express.Router();
const UserController = require("./user/user.controller");

router.use("/users", UserController);

module.exports = router;
