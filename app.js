//jshint esversion:6
require("dotenv").config(); //level-4
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();
const port = 8000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});

userSchema.plugin(passportLocalMongoose); //plugin passport-Local Mongoose into your User schema
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

//passport-local-mongoose adds a helper method createStrategy as static method to your schema. The createStrategy is responsible to setup passport-local LocalStrategy with the correct options.
passport.use(User.createStrategy());

//To maintain a login session, Passport serializes and deserializes user information to and from the session. The information that is stored is determined by the application, which supplies a serializeUser and a deserializeUser function.
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

//Google strategy to login user
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/secrets",
      //userProfileURL: "https://www,googleapis.com/oauth2/v3/userinfo", // Fix error like "Google+ API deprecated"
    },

    //this call back function allow google sends back a access token which allow us to access the user's data for a longer period of time
    function (accessToken, refreshToken, profile, cb) {
      //The method findOrCreate will create an entry in the table unless it can find one fulfilling the query options. In both cases, it will return an instance (either the found instance or the created instance) and a boolean indicating whether that instance was created or already existed.
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get("/", function (req, res) {
  res.render("home");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  }
);

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", async function (req, res) {
  try {
    const usernameExist = await User.find({ secret: { $ne: null } });

    if (usernameExist) {
      res.render("secrets", { usersWithSecrets: usernameExist });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    // req.login() requires a callback function.
    if (err) return next(err);
    res.redirect("/");
  });
});

app.post("/register", async (req, res) => {
  try {
    const newUser = await User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          // sending cookies and tell the browser to hold onto that cookie
          passport.authenticate("local")(req, res, function () {
            res.redirect("/secrets");
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(user, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.post("/submit", async function (req, res) {
  const submittedSecret = req.body.secret;

  try {
    const usernameExist = await User.findById(req.user.id);

    if (usernameExist) {
      usernameExist.secret = submittedSecret;
      await usernameExist.save();
      res.redirect("/secrets");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(8000, function () {
  console.log(`server started on port ${port}.`);
});
