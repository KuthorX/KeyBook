import CryptoJS from 'crypto-js';

export function encrypt(plainText, key) {
    return CryptoJS.AES.encrypt(plainText, key).toString();
}

export function decrypt(ciphertext, key) {
    return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
}

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
