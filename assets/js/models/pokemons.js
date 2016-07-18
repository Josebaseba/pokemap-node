$(function(){

  app.PokemonModel = Backbone.Model.extend({

    defaults: {},

    sync: function(){
      return false;
    }

  });

  app.PokemonCollection = Backbone.Collection.extend({

    model: app.PokemonModel

  });

});
