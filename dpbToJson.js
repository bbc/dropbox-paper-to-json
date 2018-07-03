require('dotenv').config();
const fs = require('fs');
const downloadDpbMd = require('./dbp-download-md/index.js');
const mdToNestedJson = require('./md-to-json/index.js');
const mdToJson = require('./md-to-json/linear.js');
// pass your access token

function dbpMdToJson(options){
    
    downloadDpbMd( options.accessToken, options.dbp_doc_id, (mdData)=>{
        
        var nested;
        // default for nested if undefined in options arguments to be true; 
        if(options.nested === undefined){
            nested = true;
        }else{
            nested = options.nested;
        }
        
        var jsonResult;
        if(nested){
            // convert to nested json 
            jsonResult = mdToNestedJson(mdData);
        }
        else{
            // convert to linear json 
            jsonResult = mdToJson(mdData);
        }
        // write output json file ?
        fs.writeFileSync(options.jsonDestFileName, JSON.stringify(jsonResult,null,2));

        // save the markdown for troubleshooting
        // fs.writeFileSync('data.txt', mdData);

        if(options.cb){
            options.cb(options.jsonDestFileName);
        }
    });
}

module.exports = dbpMdToJson;
