require('dotenv').config();
const fs = require('fs');
const dropboxpaper = require('dropbox-paper');
const mdToNestedJson = require('./md-to-json/index.js');
const mdToJson = require('./md-to-json/linear.js');
// pass your access token

function dbpMdToJson(options) {
  const paper = new dropboxpaper({ accessToken: options.accessToken });

  const dropBoxPaperMarkdownFileName = 'data';
  // Example
  // Recommends to specify "filename" to download doc. If filename is not pass default downloads it with name "download".
  // auto adds prefix `.txt` to provided file name.
  // export_format : markdown or html
  paper
    .downloadDoc({
      doc_id: options.dbp_doc_id,
      export_format: 'markdown',
      filename: dropBoxPaperMarkdownFileName
    })
    .then(function(result) {
      // done downloading the dropbox paper document markdown file
      console.log(result);

      var nested;
      // default for nested if undefined in options arguments to be true;
      if (options.nested === undefined) {
        nested = true;
      } else {
        nested = options.nested;
      }

      // get file path of markdown file
      const markdownFilename = `./${dropBoxPaperMarkdownFileName}.txt`;
      // read content
      const markdownFilecontent = fs
        .readFileSync(markdownFilename, 'utf8')
        .toString();
      // convert to nested json
      var jsonResult;

      if (nested) {
        jsonResult = mdToNestedJson(markdownFilecontent);
      } else {
        jsonResult = mdToJson(markdownFilecontent);
      }
      // write output json file ?
      fs.writeFileSync(
        options.jsonDestFileName,
        JSON.stringify(jsonResult, null, 2)
      );

      if (options.cb) {
        options.cb(options.jsonDestFileName);
      }
    })
    .catch(function(error) {
      console.error(error);
    });
}

module.exports = dbpMdToJson;
