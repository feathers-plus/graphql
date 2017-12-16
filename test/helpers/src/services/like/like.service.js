// Initializes the `like` service on path `/like`
const createService = require('feathers-nedb');
const createModel = require('../../models/like.model');
const hooks = require('./like.hooks');
const filters = require('./like.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'like',
    Model,
    paginate,
    id: 'uuid'
  };

  // Initialize our service with any options it requires
  app.use('/like', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('like');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
