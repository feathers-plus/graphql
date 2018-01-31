
// Replace all prop names starting with '__' with ones starting with '$'
const traverse = require('traverse');

module.exports = function convertArgsToParams(obj) {
  if (obj === null || obj === undefined) return obj;

  const traverser = traverse(obj);
  const paths = traverser.paths();

  for (let i = paths.length - 1; i >= 0; i--) {
    const path = paths[i];
    const key = path.slice(-1)[0]

    if (key && key.substr(0, 2) === '__') {
      const $path = [].concat(path.slice(0, -1), `$${key.substr(2)}`);
      traverser.set($path, traverser.get(path));
      traverser.set(path, undefined);
    }
  }

  traverser.forEach(function (node) {
    if (node === undefined) {
      this.remove();
    }
  });

  return obj;

  return (obj === null || obj === undefined)
    ? obj
    : JSON.parse(JSON.stringify(obj).replace(/__/g, '$'));
};
