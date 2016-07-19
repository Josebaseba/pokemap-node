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
      type: 'string'
    },

    admin: {
      type: 'boolean',
      defaults: false
    },

    message: {
      type: 'string'
    },

    toJSON: function(){
      var obj = this.toObject();
      delete this.password;
      return this;
    }

  },

  beforeCreate: function(values, next){
    values.admin = false;
    values.actived = false;
    if(values.password) return hashPassword(values, next);
    return next();
  },

  beforeUpdate: function(values, next){
    if(values.admin) delete values.admin;
    if(values.actived){
      var password = generatePassword();
      values.password = password;
      return hashPassword(values, function(err){
        if(err) return next(err);
        console.log('TODO: send welcome email with password ->', password, 'PASS CREATED');
        MailService.sendWelcome(values.id, password);
        return next();
      });
    }
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

function generatePassword() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for(var i= 0; i < 5; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
