const express = require("express");
const UserService = require("./user.service");
const router = express.Router();

router.get("/", UserService.findAllUsers);

module.exports = router;
