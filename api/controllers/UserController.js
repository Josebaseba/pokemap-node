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
        User.publishCreate(user.toJSON());
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

  online: function(req, res){
    UserStatus.online(req.session.user.id);
    return res.ok();
  },

  bot: function(req, res){
    if(!req.isSocket) return res.badRequest();
    if(!sails.bot) return res.ok();
    sails.sockets.join(req, 'bot', function(err){
      if(err) return res.serverError(err);
      return res.send(200, sails.bot);
    });
  },

  pokemonServerStatus: function(req, res){
    if(!req.isSocket) return res.badRequest();
    if(!sails.pokemonServerStatus) sails.pokemonServerStatus = 'offline';
    sails.sockets.join(req, 'serverStatus', function(err){
      if(err) return res.serverError(err);
      return res.send(200, sails.pokemonServerStatus);
    });
  },

  resetPassword: function(req, res){
    User.findOne({email: req.param('email')}).exec(function(err, user){
      if(err) return res.serverError();
      if(!user) return res.ok();
      var password = generatePassword();
      User.update({email: req.param('email')}, {password: password}).exec(function(err, user){
        if(err) return res.negotiate(err);
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
