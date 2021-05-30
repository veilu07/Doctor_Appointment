var express 			 = require('express');
var router 				 = express.Router();
const patient_controller = require('../controllers/patient_controller')
var originValidation     = require('./checkOrigin')

router.post('/createAppointment',patient_controller.createAppointment);

router.post('/getPatientAppointmentsByDate',originValidation.checkOrigin,patient_controller.getPatientAppointmentsByDate);

module.exports = router;
