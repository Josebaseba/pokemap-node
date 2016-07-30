
var path = require('path');
var sg = require('sendgrid').SendGrid(sails.config.sendGrid);

// Email templates folder relative URL
EMAIL_TEMPLATES = 'emails/';

module.exports = {

  sendWelcome: function(userId, password){
    if(sails.config.environment !== 'production') return;
    User.findOne({id: userId}).exec(function(err, user){
      if(err || !user) return;
      var helper = require('sendgrid').mail;
      var from_email = new helper.Email('pokemap@josebaseba.com');
      var to_email = new helper.Email(user.email);
      var subject = 'Ya estas en Pokemap!';
      var template = 'welcome';
      var data = {
        name : user.name || '',
        email: user.email,
        password: password
      }
      compileTemplate(template, data, function emailHTMLParsed(err, html){
        if(err) return sails.log.error(err);
        var content = new helper.Content('text/html', html);
        var mail = new helper.Mail(from_email, subject, to_email, content);
        var requestBody = mail.toJSON();
        var request = sg.emptyRequest();
        request.method = 'POST';
        request.path = '/v3/mail/send';
        request.body = requestBody;
        sg.API(request, function (response) {
          sails.log.debug(response.statusCode);
          sails.log.debug(response.body);
          sails.log.debug(response.headers);
        });
      });
    });
  },

  sendPassword: function(user, password){
    if(sails.config.environment !== 'production') return;
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email('pokemap@josebaseba.com');
    var to_email = new helper.Email(user.email);
    var subject = 'Cambio de contraseña en Pokemap';
    var template = 'reset';
    var data = {password: password};
    compileTemplate(template, data, function emailHTMLParsed(err, html){
      if(err) return sails.log.error(err);
      var content = new helper.Content('text/html', html);
      var mail = new helper.Mail(from_email, subject, to_email, content);
      var requestBody = mail.toJSON();
      var request = sg.emptyRequest();
      request.method = 'POST';
      request.path = '/v3/mail/send';
      request.body = requestBody;
      sg.API(request, function (response) {
        sails.log.debug(response.statusCode);
        sails.log.debug(response.body);
        sails.log.debug(response.headers);
      });
    });
  },

  sendMessageToAdmin: function(from, message, done){
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email('pokemap@josebaseba.com');
    var to_email = new helper.Email(sails.config.admin.email);
    var subject = 'Message from ' + from.email;
    var template = 'messageToAdmin';
    var data = {from: from, message: message};
    compileTemplate(template, data, function emailHTMLParsed(err, html){
      if(err) return sails.log.error(err);
      var content = new helper.Content('text/html', html);
      var mail = new helper.Mail(from_email, subject, to_email, content);
      var requestBody = mail.toJSON();
      var request = sg.emptyRequest();
      request.method = 'POST';
      request.path = '/v3/mail/send';
      request.body = requestBody;
      sg.API(request, function (response) {
        return done();
      });
    });
  }

}

var compileTemplate = function (view, data, done){
  var relPath = path.join(EMAIL_TEMPLATES, view);
  if(typeof data.layout === 'undefined') data.layout = false;
  sails.hooks.views.render(relPath, data, done);
};
