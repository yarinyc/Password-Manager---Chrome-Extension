const CryptoJS = require("crypto-js");

// splits an encrypted string into encrypted data and mac key
const splitMac = function(text){
    const index = text.length - 64;
    return [text.substring(0, index), text.substring(index)];
}

const data = "this is really important for me to hide!!! dasdasdasdasdasdasdasdasa"
const E = "yarin1234hlhldty"
const M = "abcdefgdfdgh"

// *** Encrypt:
const encryptedData = CryptoJS.AES.encrypt(data, E).toString();
console.log("data: ",encryptedData)
const HMAC = CryptoJS.HmacSHA256(encryptedData, M).toString();
console.log("mac:  ",HMAC)
let text = encryptedData + HMAC;

//text += "asd"

// *** Decrypt:
const [x, y] = splitMac(text);
if(CryptoJS.HmacSHA256(x, M).toString() == y){
    const bytes  = CryptoJS.AES.decrypt(x, E);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log("originalText: ", originalText)
} else {
    console.log("corrupted!")
}


