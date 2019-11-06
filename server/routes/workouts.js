const express = require("express");
const Workouts = require("../models/Workouts");
const router = express.Router();






//////////////////////////////////////////////////////////////////// GET ALL WORKOUTS FROM LOGED IN USER(IF TRAINER) //////////////////////////////////////////
router.get("/workouts",ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let loggedInUser = req.user;
  let username = loggedInUser.username;

  Workouts.find({username})
    .then(user => {
      console.log(user.workouts);
    })
    .catch(err => {
      if (err) {
        res.status(500).json({ message: `No workouts found in database` });
      }
    });
});

module.exports = router;
