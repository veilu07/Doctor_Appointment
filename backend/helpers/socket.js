var socket = require('socket.io')

module.exports.listen = function(app){
	io = socket(app,{origins:'*:*'});
	io.on('connection',(socketConnect)=>{
		console.log('Socket Connected')
	})
	return io;
}