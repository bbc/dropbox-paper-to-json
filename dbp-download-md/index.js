require('dotenv').config();
const fetch = require('node-fetch');
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

function downloadDpbMd(accessToken, dbpDocId, cb) {
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Dropbox-API-Arg': `{"doc_id": "${dbpDocId}","export_format": "markdown"}`
    };

    return fetch('https://api.dropboxapi.com/2/paper/docs/download', {
        method: 'POST',
        headers: headers
    })
        .then((response) => {
            if (response.status === 200) {
                return response.text();
            }
            return Promise.reject(
                new Error('Dropbox Paper API returned the wrong status code')
            );
        })
        .catch((error) => {
            console.error(
                'There was an error with the Dropbox Paper API response',
                error
            );
        });
}

module.exports = downloadDpbMd;
