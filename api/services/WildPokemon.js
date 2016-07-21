
var Pokeio = require('pokemon-go-node-api');
var pokemons = require('../pokemons.json');

module.exports = {

  init: function(){
    //this.mock();
    var that = this;
    //that.destroyExpired();
    this.loginPokeio(function logued(err){
      if(err) return sails.log.error('ERROR AT LOGIN:', err);
      var coords = that.calculateAllCoords();
      that.initializeWalkingBot(coords);
    });
  },

  loginPokeio: function(done){
    var location = {
      type: 'coords',
      coords: {
        altitude: 0,
        latitude: -2.73916,
        longitude: 43.22966
      }
    };
    var username = 'hackedbyme';
    var password = 'simple4321';
    var provider = 'ptc';
    Pokeio.init(username, password, location, provider, done);
  },

  calculateAllCoords: function(){
    var west =  -2.73916;
    var north =  43.221516
    var east =  -2.734473
    var south =  43.21152; // MOCKED UNTIL HERE
    // var west =  -2.73916;
    // var north =  43.23066;
    // var east =  -2.72320;
    // var south =  43.21152;
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

  initializeWalkingBot: function(points){
    var step = 0;
    var that = this;
    async.forever(
      function(next){
        Pokeio.SetLocation(points[step], function(err, coords){
          if(err){
            sails.log.error('ERROR SET LOCATION');
            return setTimeout(next, 30000);
          }
          Pokeio.Heartbeat(function(err, hb){
            if(err){
              sails.log.error('ERROR HEARTBEAT');
              return setTimeout(next, 30000);
            }
            for (var i = hb.cells.length - 1; i >= 0; i--) {
              console.log(hb.cells[i].MapPokemon);
              if(hb.cells[i].MapPokemon && hb.cells[i].MapPokemon[0]){
                for (var x = hb.cells[i].MapPokemon.length - 1; x >= 0; x--){
                  that.pokemonFound(hb.cells[i].MapPokemon[x])
                }
              }
            }
            step += 1;
            if(step > points.length - 1) step = 0;
            return next();
          });
        });
      },
      function(err){}
    );
  },

  pokemonFound: function(pokemonLocation){
  //   { SpawnpointId: '0d4e35d4c61',
  // EncounterId: Long { low: 33726077, high: -1939412224, unsigned: true },
  // PokedexTypeId: 13,
  // ExpirationTimeMs: Long { low: 252531044, high: 342, unsigned: false },
  // Latitude: 43.216107912764784,
  // Longitude: -2.7388279215132316 }
    var pokemon = Pokeio.pokemonlist[pokemonLocation.PokedexNumber - 1];
    console.log(pokemon);
    pokemon.latitude = pokemonLocation.Latitude;
    pokemon.longitude = pokemonLocation.Longitude;
    pokemon.altitude = 0;
    Pokemon.create(pokeData).exec(function(err, pokemon){
      if(err) return sails.log.error(err);
      Pokemon.publishCreate(pokemon);
    });
  },

  mock: function(){
    var mockLongitude = [43.222, 43.250, 43.270, 43.290, 43.300, 43.310, 43.315];
    var mockLatitude = [-2.729, -2.735, -2.755, -2.745, -2.760, -2.765, -2.700];
    setInterval(function(){
      var pokemon = _.shuffle(pokemons)[0];
      var pokeData = {
        number: pokemon.Number,
        name: pokemon.Name,
        pokedex: pokemon,
        altitude: 0,
        latitude: _.shuffle(mockLatitude)[0],
        longitude: _.shuffle(mockLongitude)[0]
      };
      Pokemon.create(pokeData).exec(function(err, pokemon){
        if(err) return sails.log.error(err);
        Pokemon.publishCreate(pokemon);
      });
    }, 3000);
  },

  destroyExpired: function(){
    // TODO: This is a mock
    setInterval(function(){
      Pokemon.count().exec(function(err, number){
        if(err) return sails.log.error(err);
        var position = _.random(-1, number + 1);
        Pokemon.destroy().limit(1).skip(position).exec(function(err, pokemon){
          if(err) return sails.log.error(err);
          if(!pokemon.length) return;
          Pokemon.publishDestroy(pokemon[0].id);
        });
      });
    }, 6000);
  }

};
