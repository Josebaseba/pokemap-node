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
    return res.ok();
  },

  logout: function(req, res){
    req.session.destroy();
    return res.redirect('/');
  }

};
