$(function(){

  if(!$('div#pokemap').length) return;

  var Pokemons = Backbone.View.extend({

    el: 'div#pokemap',

    events: {},

    initialize: function(){
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/pokemon', this.suscribeToPokemons);
      });
      io.socket.get('/pokemon', this.suscribeToPokemons);
      io.socket.on('pokemon', this.pokemonEvent);
    },

    suscribeToPokemons: function(pokemons, jwres){
      console.log(pokemons, jwres, 'SUB POK');
      app.pokemons = new app.PokemonCollection(pokemons);
    },

    pokemonEvent: function(event){
      console.log('POKE EVENT', event);
    }

  });

  var pokemons = new Pokemons();

});
