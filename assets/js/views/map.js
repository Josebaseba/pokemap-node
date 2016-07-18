$(function(){

  if(!$('div#pokemap').length) return;

  var Pokemap = Backbone.View.extend({

    el: 'div#pokemap',

    events: {},

    accessToken: 'pk.eyJ1Ijoiam9zZWJhc2ViYSIsImEiOiJjaXFzOHV5MWEwMGFwaTRubWl2dDVpZzlrIn0.CsuTlScie63UPdbTsdd_6w',

    mapId: 'josebaseba.0mn1ij48',

    initialize: function(){
      this.startLeaflet();
    },

    startLeaflet: function(){
      this.map = L.map('pokemap').setView([43.222, -2.729], 16);
      L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZWJhc2ViYSIsImEiOiJjaXFzOHV5MWEwMGFwaTRubWl2dDVpZzlrIn0.CsuTlScie63UPdbTsdd_6w', {
          attribution: '<span class="h5 created-by" target="_blank">Created by <a href="https://twitter.com/josebaseba">Josebaseba</a></span>',
          maxZoom: 18,
          id: this.mapId,
          accessToken: this.accessToken
      }).addTo(this.map);
    }

  });

  var pokemap = new Pokemap();

});