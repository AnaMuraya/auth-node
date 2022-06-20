require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./middleware/auth");
//user context
const User = require("./model/user");

const app = express();

const corsOptions = {
  origin: "http://localhost:4001",
  optionsSuccessStatus: 200
};

app.use(express.json({ limit: "50mb" }));
app.use(cors(corsOptions));
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

app.post("/login", async (req, res) => {
  try {
    //get user input
    const { email, password } = req.body;
    //verify user's input
    !(email && password) && res.status(400).send("All input is required");
    //check if user is genuine
    const user = await User.findOne({ email });
    !user && res.status(401).send("User does not exist");
    //check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    !isPasswordCorrect && res.status(401).send("Password is incorrect");
    //construct a JWT token that is signed
    const token = jwt.sign({ userId: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "5h",
    });
    //save token
    user.token = token;
    // return new user
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});

//you can add cors() before auth to enable cors for a single route
app.post("/home", auth, (req, res) => {
  res.status(200).send(`Welcome home, You are logged in ${req.user.email}`);
});

module.exports = app;
