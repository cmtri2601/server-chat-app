const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../user/user.model");

const generateToken = async user => {
  const { _id, username } = user;
  const accessToken = jwt.sign(
    { _id, username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" },
  );
  const refreshToken = jwt.sign(
    { _id, username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1h" },
  );

  user.refreshToken.push(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
};

const AuthenService = {
  //signup for an account
  register: async (req, res) => {
    const { username, password } = req.body;
    //Checkmissing username or password
    if (!username || !password) {
      res.status(400).send({ msg: "Missing username or password" });
      return;
    }

    //check exist username
    const exsitUser = await User.findOne({ username });
    if (exsitUser) {
      res.status(409).send({ msg: "Username is existed" });
      return;
    }

    //hash password and save
    try {
      const hashPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT),
      );
      const user = await User.create({
        username,
        password: hashPassword,
      });
      res.status(200).send({ msg: "Register successfully", user });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Something went wrong" });
    }
  },
  //sign with an account
  login: async (req, res) => {
    const { username, password } = req.body;
    //Checkmissing username or password
    if (!username || !password) {
      res.status(400).send({ msg: "Missing username or password" });
      return;
    }

    //check exist username
    const user = await User.findOne({ username });
    if (!user) {
      res.status(409).send({ msg: "Username is not existed" });
      return;
    }

    //check password
    try {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = await generateToken(user);
        res.status(200).send({ msg: "Login successfully", token });
      } else res.status(403).send({ msg: "Your credential is incorrect" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Something went wrong" });
    }
  },
  //refresh token
  refreshToken: async (req, res) => {
    const { userId, refreshToken } = req.body;
    //check valid request
    if (!refreshToken && !userId) {
      res.status(400).send({ msg: "Missing userId or refreshToken" });
      return;
    }

    //check exist user, refresh token
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      res.status(409).send({ msg: "User don't exsit" });
      return;
    }

    console.log(user);

    if (!user.refreshToken.includes(refreshToken)) {
      res.status(409).send({ msg: "Refresh token don't exsit" });
      return;
    }

    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const token = await generateToken(user);
      user.refreshToken.filter(token => token === refreshToken);
      await user.save();
      res.status(200).send({ msg: "Refresh token successfully", token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Something went wrong" });
    }
  },
  //remove refresh token
  removeRefreshToken: async (req, res) => {
    const refresh = 1;
  },
};

module.exports = AuthenService;
