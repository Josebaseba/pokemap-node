
module.exports = function (sails) {
  // store created indexes
  var indexes = [];

  var getIndexes = function (key, done) {
    var model = sails.models[key];
    // check for indexes
    if (_.isArray(model.indexes) && model.indexes.length > 0) {
      _.each(model.indexes, function (indexObject, i) {
        model.indexes[i].model = key; // add model name to index
      });
      indexes = _.union(indexes, model.indexes);
    }
    return done();
  };

  var createIndex = function (modelName, fields, options, done) {
    var model = sails.models[modelName];
    if (!model) return done();

    // check model adapter is sails-mongo by checking first connections adapter
    var connection = model
                      .adapter
                      .connections[Object.keys(model.adapter.connections)[0]];

    if (connection.config.adapter !== 'sails-mongo') return done();
    model.native(function (err, collection) {
      collection.ensureIndex(fields, options, function (err) {
        if (err) {
          sails.log.error('Mongoat: Error creating index', modelName, err);
          return done(err);
        }
        sails.log.verbose('Mongoat: An index was created for model', modelName);
        return done();
      });
    });
  };

  return {

    initialize: function (cb) {
      // Don't call it if we don't force it with config.models.createIndexes
      // The app lift faster if we don't create the index each time
      if(!sails.config.models.createIndexes) return cb();

      if (!_ || !async){
        sails.log.error('Set as globals _ and async to use mongoat hook.');
        return cb();
      } else if (!sails.hooks.orm){
        sails.log.error('Waterline ORM hook has to be actived.');
        return cb();
      }

      sails.after('hook:orm:loaded', function () {
        sails.log.verbose('sails-hook-mongoat started.');
        async.each(Object.keys(sails.models), getIndexes, startIndexCreation);
      });

      var startIndexCreation = function () {
        async.each(indexes, function createEachIndex(index, next) {
          createIndex(index.model, index.attributes, index.options || {}, next);
        }, cb);
      };

    }

  };
};
