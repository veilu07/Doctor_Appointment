const mongoose = require('mongoose')
const Schema   = mongoose.Schema;
const prefix   = require('../checkList/prefix')
const colName  = prefix.name+"Doctor";

const DoctorSchema = new Schema({
	'name' :{ type:String,require:true},
	'email':{ type:String,require:true},
	'pass' :{ type:String,require:true},
	'date' :{ type:Date,require:true},
})

module.exports = mongoose.model(colName,DoctorSchema,colName);