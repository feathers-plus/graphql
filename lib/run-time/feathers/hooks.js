
const { checkContext } = require('feathers-hooks-common');
const { extractAllItems } = require('@feathers-plus/common');

const mutatingMethods = ['patch', 'update', 'remove'];

module.exports = {
  clearDataLoaderKeys,
  clearAllDataLoaderKeys,
};

function clearDataLoaderKeys (dataLoaderNames, getDataLoaderKey) {
  return context => {
    checkContext(context, 'after', null, 'clearDataLoaderKey');
    if (mutatingMethods.indexOf(context.method) === -1) return; // ignore any custom methods
    
    if (typeof getDataLoaderKey !== 'function') {
      const fieldName = getDataLoaderKey || context.service.id;
      getDataLoaderKey = record => record[fieldName];
    }
    
    dataLoaderNames = Array.isArray(dataLoaderNames) ? dataLoaderNames : [dataLoaderNames];
    const persistedDataLoaders = context.service.persistedDataLoaders;
    const records = extractAllItems(context.result);
    
    records.forEach(record => {
      const key = getDataLoaderKey(record);
      const dataLoaderKey = typeof key === 'string' ? key : key.toString();
      
      dataLoaderNames.forEach(name => {
        persistedDataLoaders[name].clear(dataLoaderKey);
      });
    });
  };
}

function clearAllDataLoaderKeys (dataLoaderNames) {
  return context => {
    const persistedDataLoaders = context.service.persistedDataLoaders;
    
    dataLoaderNames.forEach(name => {
      persistedDataLoaders[name].clearAll();
    });
  };
}
