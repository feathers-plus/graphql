// Initializes the `post` service on path `/post`
const createService = require('feathers-nedb');
const createModel = require('../../models/post.model');
const hooks = require('./post.hooks');
const filters = require('./post.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'post',
    Model,
    paginate,
    id: 'uuid'
  };

  // Initialize our service with any options it requires
  app.use('/post', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('post');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
