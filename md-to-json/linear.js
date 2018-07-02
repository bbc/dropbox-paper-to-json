/**
 * Convert Dropbox Paper Markdown to JSON -  As Linear data structure
 * Takes markdown content as string
 * returns json
 *
 *  If working with file you'll need to open the file and convert to string before running this function
 * eg
 * // Open markdown file as string
 * const markdownFilename = "./md-to-json/test.md";
 * const markdownFilecontent =  fs.readFileSync(markdownFilename, 'utf8').toString();
 */

/**
 * Creates a json array from a string of markdown file content
 * @param {string} content - String containing markdown content
 * @returns {Array} - a json array of markdown elements
 */
function makeJson(content) {
  let contentJson = [];

  // Split text file content into list of lines.
  const textLinesArray = content.split('\n');

  // Iterate through Text lines
  // for each identify what type of "markdown element" it corresponds to.
  textLinesArray.forEach((line) => {
    // NOTE: H2 needs to be tested for before h1 otherwise it will mistake h2 as h1.
    if (isH2(line)) {
      contentJson.push(makeHeadingElement(line, 'h2'));
      // console.log(line)
    } else if (isH1(line)) {
      contentJson.push(makeHeadingElement(line, 'h1'));
      // console.log(line)
    } else if (isImg(line)) {
      contentJson.push(makeImageElement(line));
    } else if (isLinkUrl(line)) {
      contentJson.push(makeLinkElement(line));
    } else {
      // assuming that if it's not an empty line then it's a regular paragraph
      // TODO: add a test for paragraph?
      if (line !== '') {
        contentJson.push(makeParagraphElement(line));
      }
    }
  });

  return contentJson;
}

/** **************************************************************
 * Helper functions
 * helper function to determine what "markdown element" an individual line is
 */

/**
 * @param {string} text - some string text content, eg from markdown file line.
 * @param {string} element - the markdown symbol to check if it is included in the text string
 * @returns {boolean} - true if markdown symbol is included in text string, false if it is not
 */
function isMdElement(text, element) {
  return text.includes(element);
}

/**
 *
 * @param {string} text - some text to add to element
 * @returns {boolean} - true if it is a h1 tag, false if it is not
 *
 * @todo  this could be refactored to tackle from h1 to h6, altho dropbox paper only does, h1, h2 and h3 is represented as bold eg **included in symbols**
 */
function isH1(text) {
  return isMdElement(text, '#');
}

/**
 *
 * @param {string} text - some text to add to element
 * @returns {boolean} - true if it is a h2 tag, false if it is not
 */
function isH2(text) {
  return isMdElement(text, '##');
}

/**
 *
 * @param {string} text - some link string
 * @returns {boolean} - true if it is a link, false if it is not
 */
function isLinkUrl(text) {
  return isMdElement(text, 'http');
}

/**
 *
 * @param {string} text - some md element as string
 * @returns {boolean} - true if it is a image in md syntax, false if it is not
 */
function isImg(text) {
  return isMdElement(text, '![');
}

/**
 *
 * @param {string} text the markdown string, eg `## some heading 2 text`
 * @param {string} headingNumber can be 'h1' or 'h2 only
 *  @returns {json} - text attribute with text string, and type attribute with string value 'h1' or 'h2'.
 */
function makeHeadingElement(text, headingNumber) {
  var headingNumberHashes;
  // TODO: refactor this as switch statment to add support for h1 to h6?
  if (headingNumber === 'h1') {
    headingNumberHashes = '# ';
  } else if (headingNumber === 'h2') {
    headingNumberHashes = '## ';
  }
  // remove the markdown # charachters
  var tmpText = text.split(headingNumberHashes)[1];
  return { text: tmpText.trim(), type: headingNumber };
}

/**
 *
 * @param {string} text - some text to add to element
 * @returns {json} - text attribute with text string, and type attribute with string value 'link'.
 */
function makeLinkElement(text) {
  return { text: text.trim(), type: 'link' };
}

/**
 *
 * @param {string} mdImgString - some text to add to element. in the form of markdown image syntax `![alt text](img url)`
 * @returns {json} - text attribute with text string for alt text image content, url attribute for link of image,  and type attribute with string value 'img'.
 */
function makeImageElement(mdImgString) {
  // console.log(mdImgString)
  var altTextAndImgAr = mdImgString.split('](');

  // eg return `[ '![alt text', 'url)' ]`
  var altText = altTextAndImgAr[0];
  // removing preceeding `![` from md image syntax
  altText = altText.split('![')[1];

  var imgUrl = altTextAndImgAr[1];
  // removing trailing close square braket from md syntax
  imgUrl = imgUrl.split(']')[0];

  return { url: imgUrl, text: altText, type: 'img' };
}

/**
 *
 * @param {string} text - some text to add to element
 * @returns {json} - text attribute with text string, and type attribute with string value 'p' short for paragraph.
 */
function makeParagraphElement(text) {
  return { text: text.trim(), type: 'p' };
}

module.exports = makeJson;
