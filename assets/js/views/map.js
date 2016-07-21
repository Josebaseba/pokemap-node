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
      this.listenToBotPosition();
    },

    listenToBotPosition: function(){
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/bot', function(){});
      });
      io.socket.get('/bot', this.printBot.bind(this));
      io.socket.on('botLocation', this.printBot.bind(this));
    },

    printBot: function(bot){
      if(!bot) return;
      if(this.markers['bot']) this.map.removeLayer(this.markers['bot']);
      var pokeIcon = new this.MarkerStyle({iconUrl: '/img/pokemons/egg.png'});
      var marker = L.marker([bot.latitude, bot.longitude], {icon: pokeIcon}).addTo(this.map);
      this.markers['bot'] = marker;
    },

    printPokemon: function(pokemon){
      var text = '<b>' + pokemon.name + '</b><br>';
      if(pokemon.expiration){
        var date = new Date(pokemon.expiration);
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        text += 'Hasta: <b>' + time + '</b>';
      }
      var pokeIcon = new this.MarkerStyle({iconUrl: '/img/pokemons/' + parseInt(pokemon.num) + '.png'});
      var marker = L.marker([pokemon.latitude, pokemon.longitude], {icon: pokeIcon})
                    .addTo(this.map)
                    .bindPopup(text);
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
