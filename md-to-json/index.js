/**
 * Convert Dropbox Paper Markdown to JSON Linear data structure to nested JSON.
 * Nest linear json markdown elements representation, so that h1, contains all elements up to next h1.
 * Same with h2.
 */
// const readFileSync = require('fs').readFileSync;
const mdToJson = require('./linear.js');

// // Open markdown file as string
// const markdownFilename = './md-to-json/examples/test_edge_cases.md';
// const markdownFilecontent =  readFileSync(markdownFilename, 'utf8').toString();

function mdToNestedJson(markdownFilecontent) {
  // convert markdown content to linear json
  let mdJson = mdToJson(markdownFilecontent);

  let nestedMdJson = [];
  let currentElementTytpe;

  let titleElement = mdJson.shift();

  mdJson.forEach((el) => {
    // TODO: consider edge case, eg there's an H2 not preceeded by an H1?
    if (el.type == 'h1') {
      currentElementTytpe = 'h1';
      // add elements attribute for sibblings elements
      el.elements = [];
      addElementToNestedJsonArray(el, nestedMdJson);
    } else if (el.type == 'h2') {
      // nesting H2 inside H1
      currentElementTytpe = 'h2';
      // add elements attribute for sibblings elements
      el.elements = [];
      addElementToLastH1Sibling(el, nestedMdJson);
    } else {
      // nest all other elements inside h1, h2, or a 'root' level.
      if (currentElementTytpe == 'h1') {
        addElementToLastH1Sibling(el, nestedMdJson);
      } else if (currentElementTytpe == 'h2') {
        addElementToLastH2Sibling(el, nestedMdJson);
      } else {
        // this is to deal with edge case where there's text between title and first H1 tag in document.
        nestedMdJson.push(el);
      }
    }
  });

  // removing type from title of doc.
  delete titleElement.type;
  // renaming text key to title
  titleElement.title = titleElement.text;
  delete titleElement.text;
  // appending elements
  titleElement.elements = nestedMdJson;

  return titleElement;
}

/**
 * Helper functions
 */

/**
 * @param {object} - markdown element
 * @returns nothing
 */
function addElementToNestedJsonArray(el, nestedMdJson) {
  nestedMdJson.push(el);
}

/**
 * adds Element To Last H1 sibling/elements attribute
 * @param {object} el - element object
 * @param {array} nestedMdJson - json array
 * @returns nothing
 */
function addElementToLastH1Sibling(el, nestedMdJson) {
  // Lowecase, specific for news mixer project. TODO: move in linear.js add flag to turn lowercase on or of?
  el.text = el.text.toLowerCase();
  // get last h1 element in list
  let lastH1Element = returnLastH1Element(nestedMdJson);
  // append element to last h1 element
  lastH1Element.elements.push(el);
}

/**
 * adds Element To Last H2 sibling/elements attribute.
 * h2 elements are nested  in `elements` attribute of h1 elements in nestedMdJson list.
 * @param {object} el - element object
 * @param {array} nestedMdJson - json array
 * @returns nothing
 */
function addElementToLastH2Sibling(el, nestedMdJson) {
  // get last h2 element in list,
  var lastH2Element = returnLastH2Element(nestedMdJson);
  // add element to last h2 element
  lastH2Element.elements.push(el);
}

/**
 * Helper function, finds the last element with type attribute `h1` in the array list.
 * @param {array} nestedMdJson - array list of elements
 * @returns {object} - h1 element object.
 */
function returnLastH1Element(nestedMdJson) {
  let lastElementIndex = nestedMdJson.length - 1;
  let lastH1Element = nestedMdJson[lastElementIndex];
  return lastH1Element;
}

/**
 * Helper function, finds the last element with type attribute `h2` in the array list.
 * `h2` elements are nested inside h1 elements, under the `elements` attribute.
 * @param {*} nestedMdJson
 * @returns {object} - h2 element object.
 */
function returnLastH2Element(nestedMdJson) {
  let lastH1Element = returnLastH1Element(nestedMdJson);
  let lastH1ElementLastH2ElementIndex = lastH1Element.elements.length - 1;
  let lastH2Element = lastH1Element.elements[lastH1ElementLastH2ElementIndex];
  return lastH2Element;
}

module.exports = mdToNestedJson;
