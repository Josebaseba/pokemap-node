/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(done) {

  // CHECK IF WE SHOULD CREATE THE ADMIN
  User.count({admin: true}).exec(function(err, count){
    if(err || count) return;
    User.native(function(err, collection){
      if(err) return;
      var data = {
        email: sails.config.admin.email,
        name : sails.config.admin.name,
        actived: true,
        admin: true,
        status: 'offline',
        createdAt: new Date()
      };
      collection.insert(data, function(err, users){
        if(err) return;
        var id = String(users.ops[0]._id);
        var password = sails.config.admin.password;
        User.update({id: id}, {password: password}).exec(function(err, user){
          if(!err) return sails.log.info('Admin created!');
        });
      });
    });
  });

  sails.connectedUsers = 0;

  sails.on('lower', function(){
    sails.lowering = true;
  });

  WildPokemon.init();

  User.update({status: 'online'}, {status: 'offline'}).exec(function(){});

  // CREATE / UPDATE POKEDEX

  var pokedex = JSON.parse(require('fs').readFileSync('./api/pokemons.json', 'utf8'));

  async.eachLimit(pokedex, 50, function(pokemon, next){
    Pokedex.count({number: pokemon.number}).exec(function(err, pokemonExist){
      if(err) return next(err);
      if(pokemonExist) return next();
      pokemon.img = sails.config.pokedex.imageURL.replace(/\[.*?\]/g, pokemon.number);
      Pokedex.create(pokemon).exec(next);
    });
  }, done);

};
