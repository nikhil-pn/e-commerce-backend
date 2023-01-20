const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, (saltOrRounds = 10)),
  });

  try {
    const savedUser = await newUser.save();
    return res.status(200).json({ result: "New User created" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(404).json({ msg: "User not found" });

    const inputPassword = req.body.password;
    const originalPassword = await bcrypt.compare(inputPassword, user.password);

    originalPassword != inputPassword &&
      res.status(401).json({ err: "Password Mismatch" });

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      "secert",
      { expiresIn: "3d" }
    );

    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, accessToken });
  } catch (error) {
    return res.status(500).json(error);
  }
};
