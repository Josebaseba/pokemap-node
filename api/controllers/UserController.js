/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  login: function(req, res){
    if(!req.param('password') || !req.param('email')) return res.badRequest();
    User.login(req.param('email'), req.param('password'), function(err, user){
      if(err) return res.serverError(err);
      if(!user || !user.actived) return res.badRequest();
      if(!req.session) req.session = {};
      req.session.authenticated = true;
      if(user.admin) req.session.admin = true;
      req.session.user = {id: user.id};
      return res.ok();
    });
  },

  signup: function(req, res){
    if(!req.param('email') || !req.param('name')) return res.badRequest();
    User.count({email: req.param('email')}).exec(function(err, user){
      if(err) return res.serverError(err);
      if(user) return res.send(409);
      var data = {
        name    : req.param('name'),
        email   : req.param('email'),
        message : req.param('message')
      }
      User.create(data).exec(function(err, user){
        if(err) return res.negotiate(err);
        return res.ok();
      });
    });
  },

  me: function(req, res){
    User.findOne({id: req.session.user.id}).exec(function(err, user){
      if(err) return res.serverError(err);
      if(!user) return res.notFound();
      return res.json(user);
    });
  },

  resetPassword: function(req, res){
    if(!req.param('email')) return res.badRequest();
    User.findOne({email: req.param('email')}).exec(function(err, user){
      if(err) return res.serverError();
      if(!user) return res.badRequest();
      var password = generatePassword();
      User.update({email: req.param('email')}, {password: password}).exec(function(err, user){
        if(err) return res.negotiate(err);
        console.log('TODO: send welcome email with password ->', password, user, 'PASS UPDATED');
        MailService.sendPassword(user[0], password);
        return res.ok();
      });
    });
  },

  logout: function(req, res){
    req.session.destroy();
    return res.redirect('/');
  }

};

function generatePassword() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for(var i= 0; i < 5; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
