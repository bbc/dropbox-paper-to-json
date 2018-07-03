## Dropbox Paper to Markdown

<!-- _One liner + link to confluence page_ -->

A Node module to import data from a dropbox paper document and convert it into a json data structure.
 

## Setup

<!-- _stack - optional_ -->


<!-- _How to build and run the code/app_ -->

### 1. get dropbox access token

See [Generate an access token for your own account](https://blogs.dropbox.com/developers/2014/05/generate-an-access-token-for-your-own-account/)

### 2. get dropbox paper `document id`

eg if the url of your dropbox paper is something like

```
https://paper.dropbox.com/doc/Main-Title-vJdrjMJAHdgfHz0rl83Z
```

Then the last string element after the last `-`, reading from left to right, is your document id. 

In this ficticious example it would be: `vJdrjMJAHdgfHz0rl83Z`.

### 2. add `DROPBOX_ACCESS_TOKEN` to `.env`

The project uses [dotenv](https://www.npmjs.com/package/dotenv) to deal with credentials and enviroment variables.

In the root of the folder repo create a `.env` file, this is excluded from the github repo by `.gitignore` to avoid leaking credentials.

Here's an examples format of `.env` file, _with some fictitious credentials_

```
# Dropbox credentials 
DROPBOX_ACCESS_TOKEN=vJdrjMJAHdgfHz0rl83ZvJdrjMJAHdgfHz0rl83Z
DROPBOX_DOC_ID=vJdrjMJAHdgfHz0rl83Z
```
 

## Usage

### In development 

clone this repo 
```
git clone git@github.com:bbc/dropbox-paper-to-json.git
```

cd into folder 

```
cd dropbox-paper-to-json
```

`npm install`

`npm start` 

This will save a `data.json` file in the root of the project.

### In production 

npm install 

```
npm install github:bbc/ws-crossing-divides-datacleaner
```

Add to your code base 

```js
const dbpMdToJson = require('dropbox-paper-to-json/dpbToJson.js')

dbpMdToJson({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    dbp_doc_id:  process.env.DROPBOX_DOC_ID,
    // default for nested === true
    nested: true,
    jsonDestFileName: './data.json',
    // callback, triggered when done processing, is optional
    cb: callback
 });

 function callback(dest){
   console.log(`done Dropbox Paper to json conversion in: ${dest}`
 });
```
 

## System Architecture

_High level overview of system architecture_

### Downloading a Dropbox paper 
The module uses the unofficial [`dropbox-paper`](https://www.npmjs.com/package/dropbox-paper) node module sdk to get a markdown version of a dropbox paper given a dropbox paper id. 

As the official SDK didn't seem to have a straightforward way to get to a dropbox paper document content.
  
### Converting markdown dropbox paper to "linear" json 

the submodule [`md-to-json/linear.js`](./md-to-json/linear.js) takes the content of a markdown file as a string and converts it into an array of objects, representing markdown elements.

it's a flat data structure, with no nesting, hence why sometimes refered to as linear.

#### Example "linear json"

```json
[
    {
      "text": "Chapter 1",
      "type": "h1"
    },
    {
      "text": "Text",
      "type": "h2"
    },
    {
      "text": "vitae elementum velit urna id mi. Sed sodales arcu mi, eu condimentum tellus ornare non. Aliquam non mauris purus. Cras a dignissim tellus. Cras pharetra, felis et convallis tristique, sapien augue interdum ipsum, aliquet rhoncus enim diam vitae eros. Cras ullamcorper, lectus id commodo volutpat, odio urna venenatis tellus, vitae vehicula sapien velit eu purus. Pellentesque a feugiat ex. Proin volutpat congue libero vitae malesuada.",
      "type": "p"
    },
    {
      "text": "Video ",
      "type": "h2"
    },
...
]
```

### Converting linear markdown json to nested json

For some use cases it might be heplfull to nest all the elments between an h1 tag to the next h1 take as siblings/childres/elements of that tag. 

Eg h1 tag could contain h2, p tag, link etc..

Likewise h2 tag could contain all other elements up to the next h2 or h1 tag.

_NOTE_ dropbox paper flavour of markdown only properly reppresents `H1` and `H2` tags hence why we stopped the nesting only at two levels for this use case. But it could be nested further should there be a use case for it.

This is done in [`md-to-json/index.js`](./md-to-json/index.j)

#### Example "nested json"

```json 
{
  "title": "TEST CMS",
  "elements": [
    {
      "text": "Chapter 1",
      "type": "h1",
      "elements": [
        {
          "text": "some text element between h1 and h2 tags",
          "type": "p"
        },
        {
          "text": "text",
          "type": "h2",
          "elements": [
            {
              "text": "vitae elementum velit urna id mi. Sed sodales arcu mi, eu condimentum tell.",
              "type": "p"
            }
          ]
        },
       ...
}
```

For full example see [`md-to-json/examples/example_output.json`](./md-to-json/examples/example_output.json).

## Development env

 _How to run the development environment_

_Coding style convention ref optional, eg which linter to use_

_Linting, github pre-push hook - optional_

- node
- npm 
- eslint see [`.eslintrc.json`](./.eslintrc.json)
 

## Build

_How to run build_

NA `?`

<!-- might need to add Babel? to make it more widely compatible? -->

## Tests

_How to carry out tests_

Minimal test coverage using [`jest`](https://facebook.github.io/jest/) for testing, to run tests: 

```
npm test
```

## Deployment

_How to deploy the code/app into test/staging/production_

NA, it's a node module. 


## Contributing 

- Pull requests are welcome. 
- For questions, bugs, ideas feel free to raise a github issue.

---

## Notes Dropbox "flavoured" markdown 

Unforntunatelly, Dropbox paper has it's own flawour of markdown. Some of the most relevant and notable difference are: 

- Title of the doc and first `heading 1` element, are both marked has `h1` / `#`.
- `Heading 3` is represented as bold `**` instead of `h3`/`###`.
- There's no Heading 4, 5 or 6. 

### Example of dropbox flavour markdown

see [`md-to-json/examples/test.md`](./md-to-json/examples/test.md) as an example of dropbox flavour markdown file. 

### Markdown elements not included in module

- [ ] `H3` tag,since dropbox paper markdown represents it as bold `**`
- [ ] Parsing markdown github flavour tags `h3` to `h6` as not generated by dropbox paper markdown.


### Markdown elements that could be included in module
- [X] Parsing markdown github flavour tags for images eg `![alt text](link url)`. These appear on their own line.
   - _NOTE_ luckily even when displayed on the same line in dropbox paper, the images are still represented on individual lines when exported as markdown. Which makes it easier to identify as separate from other elements and parse. 

- [ ]  Parsing markdown github flavour tags for links eg `[text](link url)` these generally appear as part of a paragraph, but could also appear in their own line, or as part of a heading etc..

<!-- 
Some research link 

- [Dropbox for JavaScript Developers](https://www.dropbox.com/developers/documentation/javascript#overview)
- [Dropbox JavaScript SDK](http://dropbox.github.io/dropbox-sdk-js/index.html)
- [Dropbox access token](https://blogs.dropbox.com/developers/2014/05/generate-an-access-token-for-your-own-account/)

- [File request](https://www.dropbox.com/help/files-folders/received-file-request)

- [dropbox-paper](https://www.npmjs.com/package/dropbox-paper#download-doc) 

- [Markdown to JSON converter - python](https://github.com/njvack/markdown-to-json)
- [`json2md`](https://github.com/IonicaBizau/json2md)

-[`md-2-json`](https://www.npmjs.com/package/md-2-json)

- [`marked`](https://www.npmjs.com/package/marked)

 -->
