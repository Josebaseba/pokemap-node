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
      return res.ok();
    });
  },

  signup: function(req, res){
    if(!req.param('password') || !req.param('email') || !req.param('name')){
      return res.badRequest();
    }
    User.count({email: req.param('email')}).exec(function(err, user){
      if(err) return res.serverError(err);
      if(user) return res.send(409);
      var data = {
        name    : req.param('name'),
        email   : req.param('email'),
        password: req.param('password'),
        message : req.param('message')
      }
      User.create(data).exec(function(err, user){
        if(err) return res.negotiate(err);
        return res.ok();
      });
    });
  },

  logout: function(req, res){
    req.session.destroy();
    return res.redirect('/');
  }

};
