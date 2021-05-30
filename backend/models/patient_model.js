const mongoose = require('mongoose')
const Schema   = mongoose.Schema;
const prefix   = require('../checkList/prefix')
const colName  = prefix.name+"Patient";

const patientSchema = new Schema({
	'tokenNo' 			:{ type:String,default:''},
	'name' 				:{ type:String,require:true},
	'phno' 				:{ type:String,require:true},	
	'appointmentDate'	:{ type:Date,require:true},
	'slotId'			:{ type:mongoose.Types.ObjectId,ref:prefix.name+'Doctorslots'},
	'fromSlotTime'		:{ type:String,default:''},
	'toSlotTime'		:{ type:String,default:''},	
	'status'			:{ type:Number,default:0}, /*0-patient allocate slot 1-waiting 2-complete 3-not attend*/
	'date' 				:{ type:Date,require:true},
})

module.exports = mongoose.model(colName,patientSchema,colName);