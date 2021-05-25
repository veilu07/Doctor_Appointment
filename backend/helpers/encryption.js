const CryptoJS  = require("crypto-js");
const cryptokey = require('./safkney')
var keyutf  	= CryptoJS.enc.Base64.parse('#VmLsvRTLODGHolVegiFy#');
var iv 			= CryptoJS.enc.Base64.parse('#VmLsvRTLODGHolVegiFv#');

exports.encryptData = (value)=>{
	try{
		var  sendata = CryptoJS.AES.encrypt(value,keyutf, { iv: iv }).toString();
		return sendata;
	}
	catch(err){
		console.log('enncrpt data err',err)
		return false;
	}
}

exports.decryptData = (value)=>{
	try{
		/*var  data 	 	   = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(value)},keyutf,{iv: iv});
        const originalText = CryptoJS.enc.Utf8.stringify(data)*/

        var data 		 = CryptoJS.AES.decrypt(value, keyutf, { iv: iv });
        var originalText = data.toString(CryptoJS.enc.Utf8)

		return originalText;
	}
	catch(err){
		console.log('Dencrypt data err',err)
		return false;
	}
}