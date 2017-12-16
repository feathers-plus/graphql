
const path = require('path');
const { fileLoader, mergeTypes } = require('merge-graphql-schemas');

const typesArray = fileLoader(path.join(__dirname, '.'), { recursive: true }); // Get all in folder.

module.exports = mergeTypes(typesArray);
