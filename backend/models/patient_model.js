const mongoose = require('mongoose')
const Schema   = mongoose.Schema;
const prefix   = require('../checkList/prefix')
const colName  = prefix.name+"Patient";

const patientSchema = new Schema({
	'name' 				:{ type:String,require:true},
	'phno' 				:{ type:Number,require:true},	
	'appointmentDate'	:{ type:Date,require:true},
	'slotId'			:{ type:mongoose.Type.ObjectId,ref:prefix.name+'Doctorslots'},
	'status'			:{ type:Number,default:0}, /*0-patient allocate slot 1-waiting 2-complete 3-not attend*/
	'date' 				:{ type:Date,require:true},
})

module.exports = mongoose.model(colName,patientSchema,colName);