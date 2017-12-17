
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { parse } = require('path');
const { EOL } = require('os');

const genGraphqlCode = require('./gen-graphql-code');
const { extractCustomCode } = require('feathers-plus-common/lib/code-generation');

module.exports = function compileGraphqlSchemas (userSchema, filePaths) {
  // Extract custom code.
  Object.keys(filePaths).forEach(name => {
    const filePath = filePaths[name];
    const src = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
    extractCustomCode(src.split(EOL));
  });

  // Generate code.
  const code = genGraphqlCode(userSchema);

  // Write generated code.
  Object.keys(filePaths).forEach(name => {
    const filePath = filePaths[name];
    writeFileSync(filePath, code[name]);
  });
};
