const STRINGS = require("../utils/texts");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//login user

exports.userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    //check if user email exists
    let userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(403).json({ message: STRINGS.ERRORS.UserNotFound });
    }
    //generating uuid , a random string
    let isCorrect = bcrypt.compareSync(password, userExist.password);
    if (!isCorrect) {
      return res.status(403).json({ message: STRINGS.ERRORS.PasswordInvalid });
    }
    var token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET);
    let user = userExist;
    res.status(200).json({ message: STRINGS.TEXTS.LoginSuccess, token, user });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};

exports.userRegister = async (req, res) => {
  try {
    let { email, password } = req.body;
    //check if user email exists
    let userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(403).json({ message: STRINGS.ERRORS.UserExists });
    }
    //generating uuid , a random string

    let hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    //
    req.body.password = hash;
    //create new user
    let user = await User.create(req.body);
    res.status(200).json({ message: STRINGS.TEXTS.UserCreated, user });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};
