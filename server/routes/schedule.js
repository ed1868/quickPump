const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index");
});

////////////////////////////// route to pull all schedule from DB //////////////////////

router.get("/", (req, res, next) => {
  Schedule.find({})
    .then(schedule => {
      console.log(`WHOLE SCHEDULE IN OUR DATABASE ---- ${schedule}`);

      if (!schedule) {
        console.log("THERE WAS A PROBLEM GETTING SCHEDULE");
      }
    })
    .catch(err => {
      if (err) {
        console.log(err);
      }
    });
});

module.exports = router;
