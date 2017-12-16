// Initializes the `user` service on path `/user`
const createService = require('feathers-nedb');
const createModel = require('../../models/user.model');
const hooks = require('./user.hooks');
const filters = require('./user.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'user',
    Model,
    paginate,
    id: 'uuid'
  };

  // Initialize our service with any options it requires
  app.use('/user', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('user');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
