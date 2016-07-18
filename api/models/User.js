/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    name: {
      type: 'string'
    },

    email: {
      type: 'email',
      unique: true
    },

    actived: {
      type: 'boolean',
      defaultsTo: false
    },

    password: {
      type: 'string',
      required: true
    },

    admin: {
      type: 'boolean',
      defaults: false
    }

  },

  beforeCreate: function(values, next){
    values.admin = false;
    if(values.password) hashPassword(values, next);
    return next();
  },

  beforeUpdate: function(values, next){
    if(values.admin) delete values.admin;
    if(values.password) hashPassword(values, next);
    return next();
  },

  indexes: [
    {
      attributes: {
        email: 1
      },
      options: {
        unique: true
      }
    }
  ]

};

function hashPassword(values, next) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(values.password, salt, function(err, hash) {
      if (err) return next(err);
      values.password = hash;
      next();
    });
  });
}
