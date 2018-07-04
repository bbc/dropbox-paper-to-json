require('dotenv').config();
/**
 * Module to download Markdown file content from Dropbox Paper API
 * with access token and doc id
 * use callback to get result from request
 * Note: The content of the markdown file is returned in the body of the request.
 * Not as a file.
 *
 * More on the API From official docs
 * https://www.dropbox.com/developers/documentation/http/documentation#paper-docs-download
 *
 */
const request = require('request');

function downloadDpbMd(accessToken, dbpDocId, cb) {
    var headers = {
        Authorization: `Bearer ${accessToken}`,
        'Dropbox-API-Arg': `{"doc_id": "${dbpDocId}","export_format": "markdown"}`
    };

    var options = {
        url: 'https://api.dropboxapi.com/2/paper/docs/download',
        method: 'POST',
        headers: headers
    };

    function responseCallback(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (cb) {
                // return content of markdown through callback
                cb(body);
            }
        } else {
            console.error(
                'There was an error calling with the Dropbox Paper API response',
                error
            );
        }
    }
    // initializing the request to the API
    request(options, responseCallback);
}

module.exports = downloadDpbMd;
