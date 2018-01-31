
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
      // Our own rtns, though faster, are more likely to have a bug
      // setByPath(obj, $path, getByPath(obj, path));
      // deleteByPath(obj, path);

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
};

/*
function getByPath(obj, path) {
  return path.reduce(
    (obj1, part) => (typeof obj1 === 'object' ? obj1[part] : undefined),
    obj
  );
}

function setByPath(obj, parts, value) {
  const lastIndex = parts.length - 1;

  return parts.reduce(
    (obj1, part, i) => {
      if (i !== lastIndex) {
        if (!obj1.hasOwnProperty(part) || typeof obj1[part] !== 'object') {
          obj1[part] = {};
        }
        return obj1[part];
      }

      obj1[part] = value;
      return obj1;
    },
    obj
  );
}

function deleteByPath(obj, parts) {
  const nonLeafLen = parts.length - 1;

  for (let i = 0; i < nonLeafLen; i++) {
    let part = parts[i];
    if (!(part in obj)) { return; }

    obj = obj[part];

    if (typeof obj !== 'object' || obj === null) {
      throw new errors.BadRequest(`Path '${path}' does not exist. (convert-args-to-params)`);
    }
  }

  delete obj[parts[nonLeafLen]];
}
*/