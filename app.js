require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//user context
const User = require("./model/user");

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    //get user input
    const { firstName, lastName, email, password } = req.body;
    //verify user's input
    !(firstName && lastName && email && password) &&
      res.status(400).send("All input is required");
    //check if user already exists
    const existingUser = await User.findOne({ email });
    existingUser && res.status(409).send("User already exists, pleae login");
    //protect user's password via encryption using bcrypt
    encryptedPassword = await bcrypt.hash(password, 10);
    //make user account in the database
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    //construct a JWT token that is signed
    const token = jwt.sign({ userId: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "5h",
    });
    //save token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {});

module.exports = app;


// try {
//     const user = await User.findByCredentials(req.body.email, req.body.password);
//     const token = await user.generateAuthToken();
//     res.send({ user, token });
// }
// catch (error) {
//     res.status(400).send(error);
// }
