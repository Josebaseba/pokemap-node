$(function(){

  if(!$('div#pokemap').length) return;

  var Pokemap = Backbone.View.extend({

    el: 'div#pokemap',

    events: {},

    accessToken: 'pk.eyJ1Ijoiam9zZWJhc2ViYSIsImEiOiJjaXFzOHV5MWEwMGFwaTRubWl2dDVpZzlrIn0.CsuTlScie63UPdbTsdd_6w',

    mapId: 'josebaseba.0mn1ij48',

    initialize: function(){
      this.listenTo(Backbone, 'printPokemon', this.printPokemon);
      this.MarkerStyle = L.Icon.extend({
        options: {
          iconSize:     [40, 30],
          iconAnchor:   [40, 30],
          popupAnchor:  [-25, -20]
        }
      });
      this.startLeaflet();
    },

    startLeaflet: function(){
      this.map = L.map('pokemap').setView([43.222, -2.729], 16);
      L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZWJhc2ViYSIsImEiOiJjaXFzOHV5MWEwMGFwaTRubWl2dDVpZzlrIn0.CsuTlScie63UPdbTsdd_6w', {
          attribution: '<span class="small h6 created-by" target="_blank">Created by <a href="https://twitter.com/josebaseba">Josebaseba</a></span>',
          maxZoom: 18,
          id: this.mapId,
          accessToken: this.accessToken
      }).addTo(this.map);
      Backbone.trigger('printPokemon')
    },

    printPokemon: function(pokemon){
      var pokeIcon = new this.MarkerStyle({iconUrl: '/img/pokemons/6.png'});
      var marker = L.marker([43.222, -2.729], {icon: pokeIcon})
                    .addTo(this.map)
                    .bindPopup("I am Charmander.");
    }

  });

  var pokemap = new Pokemap();

});
