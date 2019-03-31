export function openAuthPage() {
    var fetch = require('isomorphic-fetch');
    var Dropbox = require('dropbox').Dropbox;
    var client = new Dropbox({
        fetch: fetch,
        clientId: '8w80g7hb3h4ahb5'
    });
    console.log(client);
    var authUrl = client.getAuthenticationUrl("http://localhost:3000/auth");
    window.open(authUrl);
}

export function saveFileToDropBox(token, content, okCb, errorCb) {
    var fetch = require('isomorphic-fetch');
    var Dropbox = require('dropbox').Dropbox;
    new Dropbox({
        fetch: fetch,
        accessToken: token,
    })
        .filesUpload({
            "contents": content,
            "path": "/data.json",
            "mode": {
                ".tag": "overwrite",
            },
            "autorename": false,
        })
        .then(okCb, errorCb);
}

export function openFileFromDropBox(token) {
    var fetch = require('isomorphic-fetch');
    var Dropbox = require('dropbox').Dropbox;
    new Dropbox({
        fetch: fetch,
        accessToken: token,
    })
        .fileRequestsList()
        .then(file_requests => {
            console.log(file_requests);
        }, error => {
            console.log(error);
        });
}
