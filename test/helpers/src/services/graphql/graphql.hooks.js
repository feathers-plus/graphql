
const { hooks: { clearDataLoaderKeys } } = require('../../../../../lib'); // normally use: require('feathers-graphql')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  
  after: {
    all: [
      /*
      hook => {
        const persistedDataLoaders = hook.service.persistedDataLoaders;
        Object.keys(persistedDataLoaders).forEach(key => {
          console.log(`persisted DataLoader "${key}" with keys:`, persistedDataLoaders[key]._options.cacheMap.keys()); // eslint-disable-line
        });
      },
      */
      clearDataLoaderKeys('user_uuid', 'uuid'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
