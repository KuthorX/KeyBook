import CryptoJS from 'crypto-js';

function encryptMany(plainText, key, many) {
    let ciphertext = plainText;
    for (let i = 0; i < many; i++) {
        ciphertext = CryptoJS.AES.encrypt(ciphertext, key).toString();
    }
    return ciphertext;
}

function decryptMany(ciphertext, key, many) {
    let plainText = ciphertext;
    for (let i = 0; i < many; i++) {
        plainText = CryptoJS.AES.decrypt(plainText, key).toString(CryptoJS.enc.Utf8);
    }
    return plainText;
}

onmessage = function (e) {
    let method = e.method;
    if (method === "encryptMany") {
        postMessage(encryptMany(e.args["plainText"], e.args["key"], e.args["many"]))
    } else if (method === "decryptMany") {
        postMessage(decryptMany(e.args["ciphertext"], e.args["key"], e.args["many"]))
    }
}