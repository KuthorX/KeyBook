export function openAuthPage() {
    var fetch = require('isomorphic-fetch');
    var Dropbox = require('dropbox').Dropbox;
    var client = new Dropbox({
        fetch: fetch,
        clientId: '8w80g7hb3h4ahb5'
    });
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

export function openFileFromDropBox(token, okCb, errorCb) {
    var fetch = require('isomorphic-fetch');
    var Dropbox = require('dropbox').Dropbox;
    new Dropbox({
        fetch: fetch,
        accessToken: token,
    })
        .filesListFolder({ "path": "" })
        .then(file_requests => {
            let entries = file_requests["entries"];
            let path = "";
            for (let i = 0; i < entries.length; i++) {
                if (entries[i]["name"] === "data.json") {
                    path = entries[i]["path_display"];
                }
            }
            if (path === "") {
                return errorCb("cannot find any");
            }
            new Dropbox({
                fetch: fetch,
                accessToken: token,
            })
                .filesDownload({ "path": path })
                .then(file_requests => {
                    let blob = file_requests["fileBlob"];
                    var reader = new FileReader();
                    reader.addEventListener("loadend", function (event) {
                        let re = event.target.result;
                        okCb(re);
                    });
                    reader.readAsText(blob, 'utf-8');
                }, error => {
                    errorCb(error);
                });
        }, error => {
            errorCb(error);
        });
}
