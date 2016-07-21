module.exports = {

  init: function(){
    this.mock();
    this.calculateAllCoords();
    this.destroyExpired();
  },

  calculateAllCoords: function(){
    var west =  -2.73916;
    var north =  43.23066;
    var east =  -2.72320;
    var south =  43.21152;
    var points = [];
    var allLatitudes = [];
    while(west < east){
      allLatitudes.push(west);
      west += 0.001;
    }
    var allLongitudes = [];
    while(north > south){
      allLongitudes.push(north);
      north -= 0.001;
    }
    for(var i = 0; allLatitudes.length > i; i++){
      for(var x = 0; allLongitudes.length > x; x++){
        points.push({latitude: allLatitudes[i], longitude: allLongitudes[x]});
      }
    }
    var x = 0;
    async.forever(
        function(next){
          //console.log(points[x]);
          x += 1;
          if(x >= points.length) x = 0;
          setTimeout(function(){
            return next();
          }, 200);
        },
        function(err){

        }
    );
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
