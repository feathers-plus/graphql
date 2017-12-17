
module.exports = {
  extractAllItems,
  extractFirstItem,
};

// Return an array of objects from a Feathers service call.
function extractAllItems (result) {
  if (!result) return null;

  if (!Array.isArray(result)) result = ('data' in result) ? result.data : result;
  if (!result) return null;
  
  if (!Array.isArray(result)) result = [result];

  return result;
}

// Return the first and only object from a Feathers service call, or null if none.
function extractFirstItem (result) {
  const data = extractAllItems(result);
  if (!data) return null;
  
  if (data.length > 1) throw new Error(`service.find expected 0 or 1 objects, not ${data.length}.`);

  return data.length ? data[0] : null;
}
