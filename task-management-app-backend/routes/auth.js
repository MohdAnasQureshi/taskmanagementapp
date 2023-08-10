const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");

const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "anasisgoodb$oy";

//route 1 create a user using : POST "/api/auth/createuser", does not require auth, no login required

router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", " passsword must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("name", "Entera valid name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    // if  there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "sorry a user with same email already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

//route 2 Authenticate a user using : POST "/api/auth/login", does not require auth, no login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // if  there are errors return bad request ans the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.send({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

// route 3 get logged in user details using : post " /api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});
module.exports = router;
