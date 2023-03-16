const express = require("express");
const AuthenService = require("./authen.service");
const router = express.Router();

router.post("/register", AuthenService.register);
router.post("/login", AuthenService.login);
router.post("/refresh-token", AuthenService.refreshToken);
router.post("/remove-refresh-token", AuthenService.removeRefreshToken);

module.exports = router;
