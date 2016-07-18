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
    },

    toJSON: function(){
      var obj = this.toObject();
      delete this.password;
      return this;
    }

  },

  beforeCreate: function(values, next){
    values.admin = false;
    if(values.password) return hashPassword(values, next);
    return next();
  },

  beforeUpdate: function(values, next){
    if(values.admin) delete values.admin;
    if(values.password) return hashPassword(values, next);
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
  ],

  login: function(email, password, done){
    User.findOne({email: email}).exec(function(err, user){
      if(err) return done(err);
      bcrypt.compare(password, user.password, function (err, valid){
        if(err || !valid) return done();
        return done(null, user.toJSON());
      });
    });
  }

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
