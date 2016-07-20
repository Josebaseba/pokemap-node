module.exports = {

  online: function(userId){
    User.update({id: userId}, {status: 'online'}).exec(sails.log.silly);
    User.publishUpdate(userId, {status: 'online'});
  },

  offline: function(userId){
    User.update({id: userId}, {status: 'offline'}).exec(sails.log.silly);
    User.publishUpdate(userId, {status: 'offline'});
  }

};
