
const DataLoader = require('dataloader');
const { extractAllItems } = require('feathers-plus-common');
const dataLoaderCacheLru = require('dataloader-cache-lru');
const dataloaderAlignResults = require('dataloader-align-results');
const debug = require('debug')('f-data-loader');

let logger;

module.exports = {
  feathersDataLoaderInit,
  feathersDataLoader,
};

// Initialization call
function feathersDataLoaderInit(logger1) {
  logger = logger1;
  if (logger1 === null) logger = () => {};
  if (logger1 === undefined) {
    logger = (msg, detail) => {
      throw new Error(`${msg}\n${detail || ''}`);
    };
  }
}

/*
  Feathers adapter for DataLoader - converts Feathers service call results into GraphQL format.
  
  @param {String} resolverName - Name of resolver. Only used in info/error logs.
  @param {String} graphqlType - Type of GraphQL result to return for each DataLoader key
      '[!]!' - required collection of required elements
      '[!]'  - optional collection of required elements
      '[]'   - optional collection of optional elements
      '!'    - required object
      ''     - optional object
  @param {String|Function} serializeRecordKey1 - Serialize record key.
      Return serialized key from record, identical to that produced by serializeDataLoaderKey1.
      Function - record => serialized key
      String - Converts to record => record[serializeRecordKey1].toString();
  @param {Number} max - Maximum number of items in the cache. Will use LRU cache.
  @param {Promise} getRecords - Feathers call to read records given [keys] from DataLoader.
      Can return a '.get()' object or array, else a paginated or non-paginated '.find()' object.
      An error is caught and processed as an empty array.
  @param {String|Function} serializeDataLoaderKey1 -
      Serialize key from DataLoader.load(), identical to that produced by serializeRecordKey1.
      Function - key => serialized key e.g. '1' or '{"name":"a","age":20}'
      String - Converts to key => key.toString();
 */

function feathersDataLoader(
  resolverName, graphqlType, serializeRecordKey, getRecords, max, serializeDataLoaderKey1
) {
  debug(`feathersDataLoader entered. "${resolverName}" "${graphqlType}"`);
  
  const serializeDataLoaderKey = typeof serializeDataLoaderKey1 === 'function'
    ? serializeDataLoaderKey1 : key => key.toString();
  
  return new DataLoader(
    dataLoader(graphqlType, serializeRecordKey, getRecords), {
      cacheKeyFn: serializeDataLoaderKey,
      cacheMap: typeof max === 'number' ? dataLoaderCacheLru({ max }) : undefined,
    }
  );
}

// Returns callback function for DataLoader.
// Note that serializeDataLoaderKey has already been passed to DataLoader as cacheKeyFn
function dataLoader(graphqlType, serializeRecordKey, getRecords) {
  const aligner = dataloaderAlignResults({ graphqlType, serializeRecordKey, onError: logger });
  
  // Callback for DataLoader
  return keys => getRecords(keys)
    .then(resultArray => aligner(keys, extractAllItems(resultArray)));
}
