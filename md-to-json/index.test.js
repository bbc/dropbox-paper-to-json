const readFileSync = require('fs').readFileSync;
// http://jestjs.io/docs/en/jest-platform#jest-get-type
const getType = require('jest-get-type');

const mdToNestedJson = require('./index.js');

const markdownFilename = './md-to-json/examples/test_edge_cases.md';
const markdownFilecontent = readFileSync(markdownFilename, 'utf8').toString();

// Opening file and then parsing because is a "json array" rather then a "json object"
// and `require` seems to struggle with opening that with the correct type.
const nestedMdJson = JSON.parse(
    readFileSync('./md-to-json/examples/nested.json', 'utf8').toString()
);

describe('Dropbox Paper Markdown Content To linear JSON', () => {
    var result = mdToNestedJson(markdownFilecontent);

    test('To return a json', () => {
        expect(getType(result)).not.toBe('json');
    });

    test('have all the same properties', () => {
        expect(result).toEqual(nestedMdJson);
    });
});
