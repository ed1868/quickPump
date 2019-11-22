const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

const appointmentController = require('../controllers/appointments');
const slotController = require('../controllers/slot');
router.get('/appointments', appointmentController.all);
router.get('/retrieveSlots', slotController.all);
router.post('/appointmentCreate', appointmentController.create);

module.exports = router;
