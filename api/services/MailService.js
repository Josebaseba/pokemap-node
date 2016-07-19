var sg = require('sendgrid');

module.exports = {

  sendWelcome: function(userId, password){
    User.findOne({id: userId}).exec(function(err, user){
      if(err || !user) return;
      return console.log('SEND WELCOME + PASSWORD TO', user.email, password);
    });
  },

  sendPassword: function(user, password){
    return console.log('SEND PASSWORD TO', user.email, password);
  }

}
