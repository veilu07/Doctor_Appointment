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
		  { 'slotDate'		  : 'required',
		  	'fromTimeValue'	  : 'required',
		  	'fromTimeKey'	  : 'required',
		  	'toTimeValue'  	  : 'required',
		  	'toTimeKey'  	  : 'required'
		   }
		);		
		validate.check().then(function (matched) {		  
			if(!matched && validate.errors ){
				res.json({status:404,message:"Please fill all fields",data:validate.errors});
				res.end();
			}
			else{
				var getDetails = req.body;
				var slotFrom   = parseFloat(req.body.fromTimeKey);
				var slotTo	   = parseFloat(req.body.toTimeKey);
				var diffTime   = slotTo - slotFrom;
				
				if( diffTime != 0 && diffTime == 30 ){
					var slotDate   = new Date(getDetails.slotDate)				
					var date 	   = moment(slotDate,"DD-MM-YYYY").add(1,'days');					
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
									if(!err && slotData.length>0){
										res.json({status:404,message:"Slot Already allocated"});
										res.end()
									}
									else if(!err&& slotData.length == 0){										
										var match={'slotDate':{$gte:new Date(start),$lt:new Date(end)}}
										doctorSlotCol.find(match,(err,slotFindData)=>{
											if( !err && slotFindData.length > 0 ){
												var slotUpdateObj 		  = {'fromTimeValue':req.body.fromTimeValue,'toTimeValue':req.body.toTimeValue,status:false,'toTimeKey':req.body.toTimeKey,'fromTimeKey':req.body.fromTimeKey};
												doctorSlotCol.updateOne({'_id':slotFindData[0]._id},{$push:{'slots':slotUpdateObj}},(err,updateData)=>{
													if(!err && updateData){
														res.json({status:200,message:"Slot Created Successfully",data:{'slots':slotUpdateObj}});
														res.end()
													}
													else{
														res.json({status:404,message:"Slot creation failed",data:err});
														res.end()
													}
												})
											}	
											else if( !err && slotFindData.length == 0){
												var createData   	  = {};
												var slotArray 		  = [{'fromTimeValue':req.body.fromTimeValue,'toTimeValue':req.body.toTimeValue,status:false,'toTimeKey':req.body.toTimeKey,'fromTimeKey':req.body.fromTimeKey}];
												createData.slotDate   = date;
												createData.slots   	  = slotArray;
												createData.date   	  = moment().format();
												doctorSlotCol.create(createData,(err,createdata)=>{
													if(!err && createdata){
														res.json({status:200,message:"Slot Created Successfully ",data:createdata});
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
				var date 	   = moment(slotDate,"DD-MM-YYYY").add(1,'days');									
				if(date.isValid()){
					var start 	  = moment(date).startOf('day') 
					var end 	  = moment(date).endOf('day') 
					var match={'slotDate':{$gte:new Date(start),$lt:new Date(end)}}
					doctorSlotCol.find(match,(err,slotData)=>{
						if( !err && slotData.length > 0 ){
							res.json({status:200,message:"List Slots",data:slotData[0]});
							res.end();
						}
						else if( !err && slotData.length == 0 ){
							res.json({status:422,message:"Get Slot empty",data:[]});
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


/*function getslotAllocatePatent(records){

}*/