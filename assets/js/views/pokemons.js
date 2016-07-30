$(function(){

  if(!$('div#pokemap').length) return;

  var Pokemons = Backbone.View.extend({

    el: 'div#pokemap',

    events: {},

    initialize: function(){
      this.listenTo(Backbone, 'getPokemons', this.getPokemons);
      this.listenTo(Backbone, 'refreshPokemons', this.refreshPokemons);
      this.removeExpiredPokemons();
    },

    getPokemons: function(){
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/pokemon', function(){});
      });
      io.socket.get('/pokemon', this.suscribeToPokemons.bind(this));
      io.socket.on('pokemon', this.pokemonEvent.bind(this));
    },

    suscribeToPokemons: function(pokemons, jwres){
      this.pokemons = new app.PokemonCollection(pokemons);
      this.pokemons.each(function(pokemon){
        Backbone.trigger('printPokemon', pokemon.toJSON());
      });
    },

    refreshPokemons: function(done){
      if(!this.pokemons) return;
      var that = this;
      io.socket.get('/pokemon', function(pokemons){
        _.each(_.clone(that.pokemons.models), function(pokemon) {
          Backbone.trigger('destroyPokemon', pokemon.get('id'));
          pokemon.destroy();
        });
        that.pokemons = new app.PokemonCollection(pokemons);
        that.pokemons.each(function(pokemon){
          Backbone.trigger('printPokemon', pokemon.toJSON());
        });
        return done();
      });
    },

    pokemonEvent: function(event){
      if(event.verb === 'created'){
        this.pokemons.add(event.data);
        Backbone.trigger('printPokemon', event.data);
      }else{
        this.pokemons.remove({id: event.id});
        Backbone.trigger('destroyPokemon', event.id);
      }
    },

    removeExpiredPokemons: function(){
      var that = this;
      setInterval(function(){
        if(!that.pokemons || !that.pokemons.length) return;
        var expiredPokemons = that.getExpiredPokemons();
        if(!expiredPokemons,length) return;
        _.each(expiredPokemons, function(pokemon){
          Backbone.trigger('destroyPokemon', pokemon.get('id'));
          pokemon.destroy();
        }, that);
      }, 5000);
    },

    getExpiredPokemons: function(){
      var date = new Date().getTime();
      return this.pokemons.filter(function(pokemon){
        return new Date(pokemon.get('expiration')).getTime() <= date;
      });
    }

  });

  var pokemons = new Pokemons();

});
