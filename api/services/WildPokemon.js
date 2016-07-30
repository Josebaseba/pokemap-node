
var pokemons = require('../pokemons.json');

module.exports = {

  init: function(){
    this.destroyExpired();
    _.each(sails.config.botUsers, function(botUserData){
      this.startProcess(botUserData);
    }, this);
  },

  startProcess: function(botUserData){
    var that = this;
    UserStatus.pokemonServerStatus('offline');
    if(this[botUserData.botName]) delete this[botUserData.botName];
    var PokemonGO = require('pokemon-go-node-api');
    this[botUserData.botName] = new PokemonGO.Pokeio();
    this.loginPokeio(that, botUserData, function logued(err){
      if(err){
        sails.log.error('ERROR AT LOGIN:', err);
        return setTimeout(function(){
          that.startProcess(botUserData);
        }, 10000);
      }
      var points = that.calculateAllCoords();
      if(botUserData.reverse) points = points.reverse();
      that.initializeWalkingBot(points, botUserData);
    });
  },

  loginPokeio: function(that, botUserData, done){
    var location = sails.config.initialLocation;
    var username = botUserData.username;
    var password = botUserData.password;
    var provider = botUserData.provider;
    this[botUserData.botName].init(username, password, location, provider, function(err){
      if(err) return that.startProcess.call(that, botUserData);
      if(that[botUserData.botName].playerInfo.apiEndpoint === 'https://null/rpc'){
        return that.startProcess.call(that, botUserData);
      }
      return done();
    });
  },

  calculateAllCoords: function(){
    var west = sails.config.botMapCoords.west;
    var north = sails.config.botMapCoords.north;
    var east =  sails.config.botMapCoords.east;
    var south = sails.config.botMapCoords.south;
    var points = [];
    var allLongitudes = [];
    while(west < east){
      allLongitudes.push(west);
      west += 0.001;
    }
    var allLatitudes = [];
    while(north > south){
      allLatitudes.push(north);
      north -= 0.001;
    }
    for(var i = 0; allLatitudes.length > i; i++){
      for(var x = 0; allLongitudes.length > x; x++){
        points.push({
          type: 'coords',
          coords: {
            altitude: 0,
            latitude: allLatitudes[i],
            longitude: allLongitudes[x]
          }
        });
      }
    }
    return points;
  },

  initializeWalkingBot: function(points, botUserData){
    var step = 0;
    var that = this;
    var errors = 0;
    async.forever(
      function(next){
        that[botUserData.botName].SetLocation(points[step], function(err, coords){
          if(err){
            errors += 1;
            sails.log.error('ERROR SET LOCATION', err, new Date());
            if(errors < 10) return setTimeout(next, 3000);
            return next('Error in the Location');
          }
          if(!sails.bots) sails.bots = {};
          sails.bots[botUserData.botName] = coords;
          sails.sockets.broadcast('bot', 'botLocation', sails.bot);
          that[botUserData.botName].Heartbeat(function(err, hb){
            if(err){
              errors += 1;
              sails.log.error('ERROR HEARTBEAT', err, new Date());
              if(errors < 10) return next();
              return next('Error in the Heartbeat');
            }
            errors = 0;
            UserStatus.pokemonServerStatus('online');
            for (var i = hb.cells.length - 1; i >= 0; i--) {
              if(hb.cells[i].MapPokemon && hb.cells[i].MapPokemon[0]){
                for (var x = hb.cells[i].MapPokemon.length - 1; x >= 0; x--){
                  that.pokemonFound(hb.cells[i].MapPokemon[x], botUserData, that);
                }
              }
            }
            step += 1;
            if(step > points.length - 1) step = 0;
            return next();
          });
        });
      },
      function(err){
        sails.log.error('Stop async.forever ->', err);
        that.startProcess(botUserData);
      }
    );
  },

  pokemonFound: function(pokemonLocation, botUserData, that){
    //   { SpawnpointId: '0d4e35d4c61',
    // EncounterId: Long { low: 33726077, high: -1939412224, unsigned: true },
    // PokedexTypeId: 13,
    // ExpirationTimeMs: Long { low: 252531044, high: 342, unsigned: false },
    // Latitude: 43.216107912764784,
    // Longitude: -2.7388279215132316 }
    var pokemon = that[botUserData.botName].pokemonlist[pokemonLocation.PokedexTypeId - 1];
    if(!pokemon) return;
    delete pokemon.id;
    pokemon.latitude = pokemonLocation.Latitude;
    pokemon.longitude = pokemonLocation.Longitude;
    pokemon.altitude = 0;
    if(pokemonLocation.ExpirationTimeMs.toNumber() < 0) return;
    pokemon.expiration = new Date(pokemonLocation.ExpirationTimeMs.toNumber());
    var where = {
      position: pokemon.position,
      latitude: pokemon.latitude,
      longitude: pokemon.longitude
    };
    Pokemon.findOne(where).exec(function(err, repited){
      if(err || repited) return;
      Pokemon.create(pokemon).exec(function(err, pokemon){
        if(err) return sails.log.error(err);
        Pokemon.publishCreate(pokemon);
      });
    });
  },

  destroyExpired: function(){
    setInterval(function(){
      Pokemon.destroy({expiration: {'<=': new Date()}}).exec(function(err, pokemons){
        if(err) return sails.log.error(err);
        _.each(pokemons, function(pokemon){
          Pokemon.publishDestroy(pokemon.id);
        });
      });
    }, 3000);
  }

};
