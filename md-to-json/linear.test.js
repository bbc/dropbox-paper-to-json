const fs = require('fs');
// http://jestjs.io/docs/en/jest-platform#jest-get-type
const getType = require('jest-get-type');

const mdToJson = require('./linear.js');

const markdownFilename = './md-to-json/examples/test.md';
const markdownFilecontent = fs.readFileSync(markdownFilename, 'utf8').toString();

// Opening file and then parsing because is a "json array" rather then a "json object"
// and `require` seems to struggle with opening that with the correct type.
const linearMdJson = JSON.parse(
    fs.readFileSync('./md-to-json/examples/linear.json', 'utf8').toString()
);

describe('Dropbox Paper Markdown Content To linear JSON', () => {
    var result = mdToJson(markdownFilecontent);

    test('To return a json', () => {
        expect(getType(result)).not.toBe('json');
    });

    test('have all the same properties', () => {
        expect(result).toEqual(linearMdJson);
    });
});
