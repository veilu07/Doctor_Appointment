const doctorSlotCol	= require('../models/doctorslots_model');
const patientCol	= require('../models/patient_model');
const { Validator } = require('node-input-validator');
const moment 		= require('moment');
const async 		= require('async');
const encryption 	= require('../helpers/encryption');
const mongoose 		= require('mongoose')

exports.createAppointment = (req,res)=>{
	try{	
		const validate = new Validator(req.body,		  
		  { 'name': 'required',
		  	'phno': 'required', 
		  	'appointmentDate': 'required',
		  	'slotId': 'required',
		  	'fromTimeValue': 'required',
		  	'toTimeValue': 'required'
		   }
		);		
		validate.check().then(function (matched) {		  
			if(!matched && validate.errors ){
				res.json({status:404,message:"Please fill all fields",data:validate.errors});
				res.end();
			}
			else{
				var getDetails = req.body;
				var appDate    = new Date(getDetails.appointmentDate)
				var date 	   = moment(appDate,"DD-MM-YYYY").add(1,'days');					
				var curDate    = moment().format('MM-DD-YYYY');	
				if(date.isValid()){
					date 	   		  = moment(date).format('MM-DD-YYYY');
					var issameorafter = moment(date).isSameOrAfter(curDate);
					if(issameorafter){
						var start 	  	= moment(date).startOf('day')
						var end 	  	= moment(date).endOf('day') 
						var currentHM 	= moment().format('HH:MM')
						var fromSlotTime= req.body.fromTimeValue;

						var entrycheck  = moment(date).isSame(curDate) == true ? parseFloat(currentHM) <= parseFloat(fromSlotTime) : moment(date).isAfter(curDate); 					
						if(entrycheck){
							var match={'slotDate':{$gte:new Date(start),$lt:new Date(end)},"slots":{'$elemMatch':{'fromTimeValue':req.body.fromTimeValue,'toTimeValue':req.body.toTimeValue}}}								
								doctorSlotCol.find(match,(err,slotData)=>{
									if( !err && slotData.length > 0 ){
										slotData = slotData[0];
										if(slotData.status == true ){
											res.json({status:404,message:"Already Booked"});
											res.end()
										}
										else{
											var patientmatch = {'appointmentDate':{$gte:new Date(start),$lt:new Date(end)},'name':encryption.encryptData(getDetails.name)};
											patientCol.find(patientmatch,(err,finddata)=>{
												if( !err && finddata.length > 0 ){
													res.json({status:404,message:'Already slot allocated'});
													res.end()
												}
												else if( !err && finddata.length == 0 ){
													var createdata 	 			= {};
													createdata.slotId 			= slotData._id;
													createdata.name  			= encryption.encryptData(getDetails.name);
													createdata.appointmentDate  = date;
													createdata.date  			= moment().format();
													createdata.phno  			= encryption.encryptData(String(getDetails.phno));
													createdata.fromSlotTime  	= getDetails.fromTimeValue;
													createdata.toSlotTime 	 	= getDetails.toTimeValue;
													patientCol.create(createdata,(err,createData)=>{
														if( !err && createData ){
															patientCol.countDocuments({_id:{$lt:mongoose.Types.ObjectId(createData._id)}},(err,count)=>{
																var tokenNumber = parseInt('8564126')+count+parseInt('1');
																patientCol.updateOne({_id:mongoose.Types.ObjectId(createData._id)},{$set:{"tokenNo":tokenNumber}},(err,updateToken)=>{																	
																	doctorSlotCol.updateOne({"_id":slotData._id,'slots.fromTimeValue':getDetails.fromTimeValue,'slots.toTimeValue':getDetails.toTimeValue},{$set:{'slots.$.status':true,'slots.$.aid':createData._id}},(err,updateData)=>{
																		if( !err && updateData ){
																			res.json({status:200,message:'Appointment Created Successfully'});
																			res.end()
																		}							
																		else{
																			res.json({status:404,message:'Patient Appointment updation failed'});
																			res.end()
																		}
																	})
																})
															})
														}
														else{
															res.json({status:404,message:'Patient Appointment creation failed'});
															res.end()
														}
													});
												}
												else{
													res.json({status:404,message:'Get patient Appointment failed'});
													res.end()
												}
											});
										}
									}
									else if( !err && slotData.length == 0){
										res.json({status:404,message:"Invalid slot",data:[]});
										res.end()
									}
									else{
										res.json({status:404,message:"Get Slot failed"});
										res.end()
									}
								})
						}
						else{
							res.json({status:404,message:'Appointment Time must be valid',data:[]});
								res.end()
						}
					}
					else{
						console.log('issameorafter',issameorafter)
						res.json({status:404,message:"Appointment date must be valid"});
						res.end()
					}
				}
				else{
					res.json({status:404,message:"Appointment Date is invalid"});
					res.end()
				}
			}
		});
	}
	catch(err){
		console.log('createAppointment catch err',err)
		res.json({status:404,message:"catch err",data:err});
		res.end();
	}
}

exports.getPatientAppointmentsByDate = (req,res)=>{
	try{
		const validate = new Validator(req.body,		  
		  { 
		  	'date': 'required'		  	
		   }
		);		
		validate.check().then(function (matched) {		  
			if(!matched && validate.errors ){
				res.json({status:404,message:"Mandatory Fields are required",data:validate.errors});
				res.end();
			}
			else{
				var getDetails = req.body;
				var appDate    = new Date(getDetails.date)
				var date 	   = moment(appDate,"DD-MM-YYYY").add(1,'days');					
				var curDate    = moment().format('MM-DD-YYYY');	
				if(date.isValid()){
					var start 	  	= moment(date).startOf('day')
					var end 	  	= moment(date).endOf('day') 
					var match 		= {'appointmentDate':{$gte:new Date(start),$lt:new Date(end)}}					
					var checkDate 	= moment(date).isSameOrAfter(curDate) == true ? 1 : 2; 							
					var sendArray   = [];
					var sno 		= 0;
					patientCol.find(match,(err,patientData)=>{
						if( !err && patientData.length > 0 ){
							async.eachOfSeries(patientData,(value,index,cb)=>{
								var sendData  = {};
								
								sendData 	  = value;
								sendData.sno  = index+1;
								sendData.name = encryption.decryptData(value.name)
								sendData.phno = encryption.decryptData(value.phno)
								sendArray.push(sendData);
								if(index == patientData.length-1 ){
									cb(sendArray)
								}
								else{
									cb()
								}								
							},(result)=>{
								console.log('result',result)
								res.json({status:200,message:"Patient List",data:result,'validation':checkDate});
								res.end();								
							})
							
						}
						else if( !err && patientData.length == 0 ){
							res.json({status:422,message:"Patient List empty",data:[]});
							res.end();	
						}
						else{
							res.json({status:404,message:"Patient List failed",data:err});
							res.end();	
						}
					});
				}
				else{
					res.json({status:404,message:"Appointment Date is invalid"});
					res.end()
				}
			}
		});
	}
	catch(err){
		console.log('getPatientAppointments catch err',err)
		res.json({status:404,message:"catch err",data:err});
		res.end();
	}
}