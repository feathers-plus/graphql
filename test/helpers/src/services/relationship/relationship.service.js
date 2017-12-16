// Initializes the `relationship` service on path `/relationship`
const createService = require('feathers-nedb');
const createModel = require('../../models/relationship.model');
const hooks = require('./relationship.hooks');
const filters = require('./relationship.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'relationship',
    Model,
    paginate,
    id: 'uuid'
  };

  // Initialize our service with any options it requires
  app.use('/relationship', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('relationship');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
