import CryptoJS from 'crypto-js';
import aesWorker from './worker/aes';
import WebWorker from './worker/WebWorker';

// File Tools
export function loadLocalFile(cb, errorCb) {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            cb(content);
        }
        reader.onerror = readerEvent => {
            var error = reader.error;
            errorCb(error);
        }
    }
    input.click();
}

// Time Tools
export function getCurrentUTC() {
    return new Date().toISOString();
}

export function getCurrentLocalTime() {
    return utc2local(getCurrentUTC());
}

export function utc2timestamp(utcStr) {
    return new Date(utcStr).getTime();
}

export function utc2local(utcStr) {
    let utc = new Date(utcStr);
    let date = utc.getFullYear() + "/" + (((utc.getMonth() + 1) < 10) ? "0" : "") + (utc.getMonth() + 1) + "/" + ((utc.getDate() < 10) ? "0" : "") + utc.getDate();
    let time = ((utc.getHours() < 10) ? "0" : "") + utc.getHours() + ":" + ((utc.getMinutes() < 10) ? "0" : "") + utc.getMinutes() + ":" + ((utc.getSeconds() < 10) ? "0" : "") + utc.getSeconds();
    return date + " " + time;
}

// Crypty Tools
export function generatePassword(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


export async function encryptMany(plainText, key, many) {
    return new Promise(resolve => {
        let ciphertext = plainText;
        for (let i = 0; i < many; i++) {
            ciphertext = CryptoJS.AES.encrypt(ciphertext, key).toString();
        }
        resolve(ciphertext);
    });
}

export async function decryptMany(ciphertext, key, many) {
    return new Promise(resolve => {
        let plainText = ciphertext;
        for (let i = 0; i < many; i++) {
            plainText = CryptoJS.AES.decrypt(plainText, key).toString(CryptoJS.enc.Utf8);
        }
        resolve(plainText);
    });
}

export async function encryptManyBackup(plainText, key, many) {
    let looping = true;
    let data = "";
    let worker = new WebWorker(aesWorker);
    worker.onmessage = function (event) {
        data = event.data;
        looping = false;
        worker.terminate();
    }
    worker.postMessage({
        "method": 'encryptMany',
        "args": {
            "plainText": plainText,
            "key": key,
            "many": many,
        }
    });
    return new Promise(resolve => {
        resolve(data);
        console.log(data);
    });
}

export async function decryptManyBackUp(ciphertext, key, many) {
    let looping = true;
    let data = "";
    let worker = new Worker('./worker/aes.js');
    worker.postMessage({
        method: 'decryptMany',
        args: {
            "ciphertext": ciphertext,
            "key": key,
            "many": many,
        }
    });
    worker.onmessage = function (event) {
        data = event.data;
        looping = false;
        worker.terminate();
    }
    return new Promise(resolve => {
        while (looping) {}
        resolve(data);
    });
}

// Copy Tools
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    var successful = false;

    try {
        successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);

    return successful;
}

export function copyTextToClipboard(text) {
    return fallbackCopyTextToClipboard(text);
    // if (!navigator.clipboard) {
    //     return fallbackCopyTextToClipboard(text);
    // }
    // navigator.clipboard.writeText(text).then(function () {
    //     console.log('Async: Copying to clipboard was successful!');
    // }, function (err) {
    //     console.error('Async: Could not copy text: ', err);
    // });
}