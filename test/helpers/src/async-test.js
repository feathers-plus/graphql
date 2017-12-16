
const deepEqual = require('deep-equal');
const { inspect } = require('util');

let graphql;

const getUser = bool => `{
  getUser(${qlParams({ key: 1 })}) {
    fullName
    posts(${qlParams({ query: { draft: bool } })}) {
      uuid
      draft
    }
  }
}`;

module.exports = function runAsyncTest (app, max) {
  graphql = app.service('/graphql');

  return Promise.all([
    runTest(0, max, 250, 0, {
      getUser: {
        fullName: 'Jessica Szwaronek',
        posts: [
          { uuid: '93', draft: 0 },
          { uuid: '94', draft: 0 }
        ]
      }
    }),

    runTest(0, max, 150, 1, {
      getUser: {
        fullName: 'Jessica Szwaronek',
        posts: [
          { uuid: '92', draft: 1 }
        ]
      }
    })
  ]);
};

function runTest (count, max, delay, bool, expected) {
  if (count > max) return;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      graphql.find({ query: { graphql: getUser(bool) } })
        .catch(err => reject(err))
        .then(response => {
          if (!deepEqual(response, expected, { strict: true })) {
            /* eslint-disable */
            console.log(`'>>>>>>> unexpected response for draft: ${bool}`);
            console.log('response:', inspect(response, { depth: 4 }));
            console.log('expected:', inspect(expected, { depth: 4 }));
            /* eslint-enable */
            throw new Error('Unexpected result');
          }

          console.log('OK', count, bool);  // eslint-disable-line

          resolve(runTest(++count, max, delay, bool, expected));
        })
        .catch(err => reject(err)); // eslint-disable-line
    }, delay);
  });
}

function qlParams (obj) {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Expected object. (qlParams)');
  }

  return stringify(obj, undefined, undefined, '', '');
}

function stringify (obj, spacer = ' ', separator = ', ', leader = '{', trailer = '}') {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return JSON.stringify(obj);
  }

  const str = Object
    .keys(obj)
    .map(key => `${key}:${spacer}${stringify(obj[key], spacer, separator)}`)
    .join(', ');

  return `${leader}${str}${trailer}`;
}
