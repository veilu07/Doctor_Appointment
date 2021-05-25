const doctorCol 	= require('../models/doctor_model')
const doctorSlotCol	= require('../models/doctorslots_model')
const { Validator } = require('node-input-validator');
const moment 		= require('moment');
const encryption 	= require('../helpers/encryption');

exports.createDoctor = (req,res)=>{
	try{
		const validate = new Validator(req.body,		  
		  { 'name': 'required',
		  	'email': 'required|email', 
		  	'pass': 'required'
		   }
		);		
		validate.check().then(function (matched) {		  
			if(!matched && validate.errors ){
				res.json({status:404,message:"Please fill all fields",data:validate.errors});
				res.end();
			}
			else{
				var getDetails = req.body;
				var email = encryption.encryptData(getDetails.email);
				doctorCol.find({"email":email},(err,finddata)=>{
					if( !err && finddata.length > 0 ){
						res.json({status:404,message:"Doctor Email already exists"});
						res.end();
					}
					else if(!err && finddata.length == 0 ){
						var createData 	 = {};
						createData.name  = encryption.encryptData(getDetails.name);
						createData.pass  = encryption.encryptData(getDetails.pass);
						createData.email = encryption.encryptData(getDetails.email);
						createData.date  = moment().format();
						
						doctorCol.create(createData,(err,createdata)=>{
							if( !err && createdata ){
								res.json({status:200,message:"Doctor Ready to attend Patient Appointment"});
								res.end();
							}
							else{								
								res.json({status:404,message:"Doctor Creation Failed",data:err});
								res.end();
							}
						});
					}
					else{
						res.json({status:404,message:"Doctor Creation Failed"});
						res.end();
					}
				});
					
			}
		})

	}
	catch(err){
		console.log('createDoctor Catch error',err);
		res.json({
			status:404,
			message:'Catch error',
			data:err
		});
		res.end();
	}
}

exports.createSlot   = (req,res)=>{
	try{
		const validate = new Validator(req.body,		  
		  { 'slotDate': 'required',
		  	'from'	  : 'required',
		  	'to'  	  : 'required'
		   }
		);		
		validate.check().then(function (matched) {		  
			if(!matched && validate.errors ){
				res.json({status:404,message:"Please fill all fields",data:validate.errors});
				res.end();
			}
			else{
				var getDetails = req.body;
				var slotFrom   = parseFloat(req.body.from);
				var slotTo	   = parseFloat(req.body.to);
				var diffTime   = slotTo - slotFrom;

				if( diffTime != 0 && diffTime == 0.7 ){
					var slotDate   = new Date(getDetails.slotDate)				
					var date 	   = moment(slotDate);
					var curDate    = moment().format('MM-DD-YYYY');
					
					if(date.isValid()){
						date 	   		  = moment(date).format('MM-DD-YYYY');
						var issameorafter = moment(date).isSameOrAfter(curDate);
						if(issameorafter){
							var start 	  	= moment(date).startOf('day') 
							var end 	  	= moment(date).endOf('day') 
							var currentHM 	= moment().format('HH.MM')
							var fromSlotTime= req.body.from;
							if(parseFloat(currentHM) <= parseFloat(fromSlotTime) ){
								var match={'slotDate':{$gte:new Date(start),$lt:new Date(end)},"slots":{'$elemMatch':{'from':req.body.from,'to':req.body.to}}}
								doctorSlotCol.find(match,(err,slotData)=>{
									if(!err && slotData.length>0){
										res.json({status:404,message:"Slot Already allocated"});
										res.end()
									}
									else if(!err&& slotData.length == 0){
										var createData   	  = {};
										var slotArray 		  = [{'from':req.body.from,'to':req.body.to,status:false}];
										createData.slotDate   = date;
										createData.slots   	  = slotArray;
										createData.date   	  = moment().format();
										doctorSlotCol.create(createData,(err,createdata)=>{
											if(!err && createdata){
												res.json({status:200,message:"Slot Created Successfully"});
												res.end()
											}
											else{
												res.json({status:404,message:"Slot creation failed",data:err});
												res.end()
											}
										})
									}
									else{
										res.json({status:404,message:"Slot find failed",data:err});
										res.end()
									}
								})
							}
							else{
								res.json({status:404,message:'Allocate slot Time must be valid',data:[]});
								res.end()
							}
						}
						else{
							console.log('issameorafter',issameorafter)
							res.json({status:404,message:"Slot date must be valid"});
							res.end()
						}
					}
					else{
						res.json({status:404,message:"Slot Date is invalid"});
						res.end()
					}
				}else{
					res.json({status:404,message:"Slot Time Interval Must be 30 Mints"});
					res.end()
				}
			}
		})
	}
	catch(err){
		console.log('createSlot Catch error',err);
		res.json({
			status:404,
			message:'Catch error',
			data:err
		});
		res.end();
	}
}

exports.listAllSlotByDate = (req,res)=>{
	try{
		const validate = new Validator(req.body,		  
		  { 'date': 'required'}
		);		
		validate.check().then(function (matched) {		  
			if(!matched && validate.errors ){
				res.json({status:404,message:"Need Mandatory Fields",data:validate.errors});
				res.end();
			}
			else{
				var getDetails = req.body;
				var slotDate   = new Date(getDetails.date)				
				var date 	   = moment(slotDate);
				
				if(date.isValid()){
					var start 	  = moment(date).startOf('day') 
					var end 	  = moment(date).endOf('day') 
					var match={'slotDate':{$gte:new Date(start),$lt:new Date(end)}}
					doctorSlotCol.find(match,(err,slotData)=>{
						if( !err && slotData.length >= 0 ){
							res.json({status:200,message:"List Slots",data:slotData});
							res.end();
						}
						else{
							res.json({status:404,message:"Get Slot failed",data:err});
							res.end();	
						}
					});
				}
				else{
					res.json({staus:404,message:"Date Must Be valid",data:[]});
					res.end()
				}
			}
		})
	}
	catch(err){
		console.log('list slot catch err',err);
		res.json({
			status:404,
			message:'Catch error',
			data:err
		});
		res.end();
	}
}