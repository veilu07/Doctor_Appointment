const mongoose =require('mongoose')
const url 	   =require('../checkList/dbUrl')
const encrypion=require('./encryption')

mongoose.set('useCreateIndex',true)

function connection(){
	mongoose.connect(encrypion.decryptData(url),{ useNewUrlParser: true, useUnifiedTopology: true,keepAlive:true }).then(()=>{
	console.log("DB connected")
	}).catch((err)=>{	
		console.log("DB connected Failed",err)
	});	
}

connection();

mongoose.connection.on('disconnected',()=>{
	console.log('DB disconnected at',new Date())
	connection()
})

