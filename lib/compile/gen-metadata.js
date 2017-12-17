
const { EOL } = require('os');

const { indent, insertCustomCode } = require('feathers-plus-common/lib/code-generation');

module.exports = function genMetadata (parsed, generatedMetadata) {
  return [
    '',
    '/* eslint indent: 0, quotes: 0 */',
    insertCustomCode('metadata-imports'),
    '',
    `let generatedMetadata = ${indent(JSON.stringify(generatedMetadata, null, 2), 0, false)};`,
    '',
    insertCustomCode('metadata-export', 'module.exports = generatedMetadata;'),
    '',
    insertCustomCode('metadata-end'),
    ''
  ].join(EOL);
};
