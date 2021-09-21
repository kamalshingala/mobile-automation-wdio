var CryptoJS = require("crypto-js");
const dotenv = require('dotenv');
dotenv.config();

// Encrypt
const ciphertext = CryptoJS.AES.encrypt(process.argv[2], process.env.ENCRYPTION_KEY).toString();
//console.log("Encrypting Text: " + process.argv[2]);
//console.log("Encrypted Text: " + ciphertext);
