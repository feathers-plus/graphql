
module.exports = function convertArgsToParams(obj) {
  return (obj === null || obj === undefined)
    ? obj
    : JSON.parse(JSON.stringify(obj).replace(/__/g, '$'));
};
