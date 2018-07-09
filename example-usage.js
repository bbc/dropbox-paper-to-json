const fs = require('fs');
const dbpMdToJson = require('./index');

dbpMdToJson({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    dbp_doc_id: process.env.DROPBOX_DOC_ID,
    // default for nested === true
    nested: true,
    cb: function(data) {
        console.log('done Dropbox Paper to json conversion');
        fs.writeFileSync('./data.json',JSON.stringify(data, null, 2));
    }
});
