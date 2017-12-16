
module.exports = function convertArgsToOrderBy(graphqlOptions) {
  const dialect = graphqlOptions.dialect; // eslint-disable-line
  
  return function convertArgsToOrderByInner(args = {}, directiveSort = {}) {
    const __sort = Object.assign({}, args.query || {}, { __sort: directiveSort }).__sort;
  
    if (typeof __sort !== 'object' || __sort === null) return undefined;
    const orderBy = {};
  
    Object.keys(__sort).forEach(key => {
      orderBy[key] = __sort[key] === -1 ? 'desc' : 'asc';
    });
  
    return orderBy;
  };
};
