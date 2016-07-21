module.exports = {

  init: function(){
    this.mock();
    this.destroyExpired();
  },

  mock: function(){
    var pokemons = require('../pokemons.json');
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
