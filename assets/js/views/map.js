$(function(){

  if(!$('div#pokemap').length) return;

  var Pokemap = Backbone.View.extend({

    el: 'div#pokemap',

    events: {},

    markers: {},

    initialize: function(){
      this.listenTo(Backbone, 'printPokemon', this.printPokemon);
      this.listenTo(Backbone, 'destroyPokemon', this.destroyPokemon);
      this.MarkerStyle = L.Icon.extend({
        options: {
          iconSize   : [40, 30],
          iconAnchor : [40, 30],
          popupAnchor: [-25, -20]
        }
      });
      this.getTokens();
    },

    getTokens: function(){
      app.proxy('GET', '/mapbox-token', {}, this.startLeaflet, this._error, this);
    },

    startLeaflet: function(data){
      this.map = L.map('pokemap').setView([43.222, -2.729], 16);
      L.tileLayer(data.tileLayer, {
          attribution: data.attribution,
          maxZoom: 18,
          id: data.mapId,
          accessToken: data.accessToken
      }).addTo(this.map);
    },

    printPokemon: function(pokemon){
      var pokeIcon = new this.MarkerStyle({iconUrl: '/img/pokemons/' + parseInt(pokemon.num) + '.png'});
      var marker = L.marker([pokemon.latitude, pokemon.longitude], {icon: pokeIcon})
                    .addTo(this.map)
                    .bindPopup('I am ' + pokemon.name + '.');
      marker.pokemonId = pokemon.id;
      this.markers[pokemon.id] = marker;
    },

    destroyPokemon: function(pokemonId){
      var marker = this.markers[pokemonId];
      this.map.removeLayer(marker);
    },

    _error: function(err){
      console.log(err);
    }

  });

  var pokemap = new Pokemap();

});
