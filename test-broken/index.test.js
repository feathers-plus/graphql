
const { assert } = require('chai');
const plugin = require('../lib');

describe('feathers-graphql', () => {
  it('basic functionality', () => {
    assert.isFunction(plugin, 'plugin not a function');
    assert.isObject(plugin(), 'service not an object');
  });
});
