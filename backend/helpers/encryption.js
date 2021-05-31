const CryptoJS  = require("crypto-js");
const cryptokey = require('./safkney')
var keyutf  	= CryptoJS.enc.Base64.parse(cryptokey.key);
var iv 			= CryptoJS.enc.Base64.parse(cryptokey.iv);

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
        var data 		 = CryptoJS.AES.decrypt(value, keyutf, { iv: iv });
        var originalText = data.toString(CryptoJS.enc.Utf8)
		return originalText;
	}
	catch(err){
		console.log('Dencrypt data err',err)
		return false;
	}
}