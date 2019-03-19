function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
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
