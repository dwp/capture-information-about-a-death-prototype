const fs = require('fs');
const process = require('process');
const folder = `${process.cwd()}/app/views/versions`;
const isDirectory = (path => fs.statSync(path).isDirectory());
const flattenArray = (files => [].concat.apply([], files));
/**
 * Reads the file and returns a stringified version if its an index page
 * @type {string}
*/
const readFile = ((path) => path.includes('index.html') ? fs.readFileSync(path).toString() : false);

/**
 * Takes a path and returns an array of all files within the given path
 * @type {array}
*/
const readDirectory = (path) => {
  if (isDirectory(path)) {
    const folders = fs.readdirSync(path);
    return flattenArray(folders.map(item => {
      return isDirectory(`${path}/${item}`) ? readDirectory(`${path}/${item}`) : `${path}/${item}`;
    })).filter(Boolean);
  }
  return [];
};

/**
 * Takes a file path, reads the file and returns the date found within the file
 * @type {number}
*/
const getDate = (f) => {
  const file = readFile(f);
  if (file) {
    const r = /^{# date(.*)#}$/gm;
    const match = r.exec(file);
    if (match) {
      return Date.parse(match[1].trim().split('-').reverse().join('-'));
    }
  }

  return null;
};

/**
 * Sorts all index.html files within the given folder and returns the file paths
 * @type {array}
*/
const fileContents = readDirectory(folder).filter(Boolean).filter(readFile).sort((a, b) => getDate(b) - getDate(a));

module.exports = fileContents;