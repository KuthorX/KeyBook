import CryptoJS from 'crypto-js';

function encryptMany(plainText, key, many) {
    let ciphertext = plainText;
    for (let i = 0; i < many; i++) {
        ciphertext = CryptoJS.AES.encrypt(ciphertext, key).toString();
        console.log(ciphertext);
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

export default () => {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        console.log(e);
        let data = e.data;
        let method = data.method;
        if (method === "encryptMany") {
            postMessage(encryptMany(data.args["plainText"], data.args["key"], data.args["many"]))
        } else if (method === "decryptMany") {
            postMessage(decryptMany(data.args["ciphertext"], data.args["key"], data.args["many"]))
        }
    })
}