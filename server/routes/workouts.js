const express = require("express");
const Workouts = require("../models/Workouts");
const User = require('../models/User');
const router = express.Router();






//////////////////////////////////////////////////////////////////// GET ALL WORKOUTS FROM LOGED IN USER(IF TRAINER) //////////////////////////////////////////
router.get("/all",ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let loggedInUser = req.user;
  let username = loggedInUser.username;

  User.find({username})
    .then(user => {
      console.log(user.workouts);
    })
    .catch(err => {
      if (err) {
        res.status(500).json({ message: `No workouts found in database` });
      }
    });
});

/////////////////////////////////////////////////////////////////ADD A WORKOUT (IF TRAINER)//////////////////////////////////////////////////]

router.get('/new', ensureLoggedIn() ,(req,res,next) => {
  res.status(200).json({ message: "ya did good" });
});

router.post('/new', ensureLoggedIn(), (req,res,next) => {
  let {
    workoutName,
    timeExpectedToComplete,
    muscleGroup,
    workout,
  } = req.body;
  let trainer = req.user.username;

  console.log('WORKOUT NAME: ', workoutName);
  console.log('WORKOUT Expected time met: ', timeExpectedToComplete);
  console.log('WORKOUT Muscle Group: ', muscleGroup);
  console.log('WORKOUT: ',workout);
  console.log('TRAINER: ', trainer);

  const newWorkout = new Workouts({
    workoutName,
    timeExpectedToComplete,
    muscleGroup,
    workoutName,
    trainer
  });

  newWorkout.save()
  .then(savedWorkout => {
    console.log(savedWorkout);
    let thePump = savedWorkout;
    User.find({trainer})
    .then(user => {
      
      user.workouts.push(thePump);
      
      console.log('NEW USER: ', user);
    })
    .catch(err => {
      console.log(err);
    })

  })
  .catch(err => {
    console.log(err);
  });


});

//////////////////////////////////////////////////////EDUIT SPECIFIC WORKOUT/////////////////////////

router.post('/:id/edit', ensureLoggedIn(), (req,res,next) => {

    let workoutId = req.params;

    console.log('THIS IS THE WORKOUT ID : ', workoutId);

    Workouts.findById({workoutId})
    .then(foundWorkout => {
      console.log('THIS IS THE FOUND WORKOUT BY THAT ID : ' ,foundWorkout);
    }).catch(err => {
      if(err){
        console.log('NO WORKOUT FOUND BY THAT ID', err);
      }
    });
});

module.exports = router;
