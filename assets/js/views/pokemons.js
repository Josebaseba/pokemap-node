$(function(){

  if(!$('div#pokemap').length) return;

  var Pokemons = Backbone.View.extend({

    el: 'div#pokemap',

    events: {

    },

    initialize: function(){
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/pokemon', function(){});
      });
      io.socket.get('/pokemon', this.suscribeToPokemons.bind(this));
      io.socket.on('pokemon', this.pokemonEvent.bind(this));
    },

    suscribeToPokemons: function(pokemons, jwres){
      console.log(pokemons, jwres, 'SUB POK');
      this.pokemons = new app.PokemonCollection(pokemons);
    },

    pokemonEvent: function(event){
      console.log('POKE EVENT', event);
    }

  });

  var pokemons = new Pokemons();

});
