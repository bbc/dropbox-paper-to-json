const dbpMdToJson = require('./dpbToJson');

dbpMdToJson({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    dbp_doc_id:  process.env.DROPBOX_DOC_ID,
    // default for nested === true
    nested: true,
    jsonDestFileName: './data.json',
    cb: function(dest){console.log(`done Dropbox Paper to json conversion in: ${dest}`);}
 });

