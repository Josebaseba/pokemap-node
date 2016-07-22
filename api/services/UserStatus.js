module.exports = {

  online: function(userId){
    User.update({id: userId}, {status: 'online'}).exec(sails.log.silly);
    User.publishUpdate(userId, {status: 'online'});
  },

  offline: function(userId){
    User.update({id: userId}, {status: 'offline'}).exec(sails.log.silly);
    User.publishUpdate(userId, {status: 'offline'});
  },

  pokemonServerStatus: function(status){
    sails.pokemonServerStatus = status;
    sails.sockets.broadcast('serverStatus', 'serverStatus', status);
  }

};
