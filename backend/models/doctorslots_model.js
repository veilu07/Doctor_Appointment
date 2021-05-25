const mongoose = require('mongoose')
const Schema   = mongoose.Schema;
const prefix   = require('../checkList/prefix')
const colName  = prefix.name+"Doctorslots";

const DoctorslotsSchema = new Schema({
	'slotDate' :{type:Date,require:true,index:true},
	'slots'	   :{type:Array,require:true },	
	'date' 	   :{type:Date,require:true }
})

module.exports = mongoose.model(colName,DoctorslotsSchema,colName);