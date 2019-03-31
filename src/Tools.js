import CryptoJS from 'crypto-js';

// File Tools
export function loadLocalFile(cb) {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => { 

       // getting a hold of the file reference
       var file = e.target.files[0]; 
    
       // setting up the reader
       var reader = new FileReader();
       reader.readAsText(file,'UTF-8');
    
       // here we tell the reader what to do when it's done reading...
       reader.onload = readerEvent => {
          var content = readerEvent.target.result; // this is the content!
          cb(content);
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

export function md5(plainText) {
    return CryptoJS.MD5(plainText).toString();
}

export function encrypt(plainText, key) {
    return CryptoJS.AES.encrypt(plainText, key).toString();
}

export function decrypt(ciphertext, key) {
    return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
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