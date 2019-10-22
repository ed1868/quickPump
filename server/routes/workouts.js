const express = require('express');
const Workouts = require('../models/Workouts');
const router  = express.Router();

/* GET home page. */
router.get('/all', (req, res, next) => {
  
  Workouts.find({}).then(workouts => {
    if(!workouts){
    
      res.status(500).json({ message: `No workouts found in database` });
    }
  })
});

module.exports = router;
