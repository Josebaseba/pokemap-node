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
      this.pokemons.each(function(pokemon){
        Backbone.trigger('printPokemon', pokemon.toJSON());
      });
    },

    pokemonEvent: function(event){
      if(event.verb === 'created'){
        Backbone.trigger('printPokemon', event.data);
      }else{
        Backbone.trigger('destroyPokemon', event.id);
      }
    }

  });

  var pokemons = new Pokemons();

});
