var express 		= require('express');
var router 			= express.Router();
var doctorController= require('../controllers/doctor_controller');
var originValidation=require('./checkOrigin')

router.post('/createDoctor',/*originValidation.checkOrigin,*/doctorController.createDoctor);

router.post('/createSlot',/*originValidation.checkOrigin,*/doctorController.createSlot);

router.post('/listAllSlotByDate',/*originValidation.checkOrigin,*/doctorController.listAllSlotByDate);


module.exports = router;
