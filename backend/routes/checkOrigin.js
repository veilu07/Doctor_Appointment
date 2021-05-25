const originList = require('../checkList/originList')

exports.checkOrigin = (req,res,next)=>{
	try{
		var origin = req.get('origin');		
		var check  = originList.indexOf(origin);		
		if(check > -1 ){
			next();
		}
		else{
			res.json({status:401,message:"Unauthorized Access"});
			res.end()
		}
	}
	catch(err){
		console.log('checkOrigin catch err',err)
		res.json({status:404,message:"Origin Validation Failed",data:err});
		res.end();
	}
}