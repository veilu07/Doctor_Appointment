const doctorSlotCol	= require('../models/doctorslots_model');
const patientCol	= require('../models/patient_model');
const { Validator } = require('node-input-validator');
const moment 		= require('moment');
const encryption 	= require('../helpers/encryption');

exports.createAppointment = (req,res)=>{
	try{	
		const validate = new Validator(req.body,		  
		  { 'name': 'required',
		  	'phno': 'required', 
		  	'appointmentDate': 'required',
		  	'slotId': 'required'
		   }
		);		
		validate.check().then(function (matched) {		  
			if(!matched && validate.errors ){
				res.json({status:404,message:"Please fill all fields",data:validate.errors});
				res.end();
			}
			else{

			}
		});
	}
	catch(err){
		console.log('createAppointment catch err',err)
		res.json({status:404,message:"catch err",data:err});
		res.end();
	}
}