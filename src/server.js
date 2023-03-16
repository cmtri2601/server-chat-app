const express = require("express");
const ProtectedRoute = require("./protectedRoute");
const AuthenController = require("./authen/authen.controller");
const verifyToken = require("./middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("This is authen server");
});

router.use("/", AuthenController);
router.use("/", verifyToken, ProtectedRoute);

module.exports = router;
