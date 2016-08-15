module.exports = {

  adminView: function(req, res){
    return res.view('admin');
  },

  connectedUsers: function(req, res){
    if(!req.isSocket) return res.send(200, sails.connectedUsers);
    sails.sockets.join(req, 'connections', function(err){
      if(err) return res.serverError(err);
      return res.send(200, sails.connectedUsers);
    });
  },

  pokedexAlert: function(req, res){
    var pokedexAlert = req.param('pokedexAlert');
    pokedexAlert = pokedexAlert === 'true' ? true : false;
    User
      .update({email: sails.config.admin.email}, {pokedexAlert: pokedexAlert})
      .exec(function(err){
        if(err) return res.negotiate(err);
        return res.ok();
      });
  }

};
