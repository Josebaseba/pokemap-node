$(function(){

  if(!$('div#pokemap').length) return;

  var Pokemap = Backbone.View.extend({

    el: 'div#pokemap',

    events: {},

    markers: {},

    initialize: function(){
      this.listenTo(Backbone, 'printPokemon', this.printPokemon);
      this.listenTo(Backbone, 'destroyPokemon', this.destroyPokemon);
      this.listenTo(Backbone, 'serverStatus', this.printServerStatus);
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
      app.proxy('GET', '/carto-viz', {}, this.startCarto, this._error, this);
    },

    startCarto: function(data){
      var that = this;
      cartodb.createVis('pokemap', data.viz, {carto_logo:false}).done(function(vis, layers) {
        that.map = vis.getNativeMap();
        that.setAttribution(data.attribution);
        Backbone.trigger('getPokemons');
        that.listenToBotPosition();
        that.listenToPokemonServerStatus();
      });
    },

    setAttribution: function(attributionHTML){
      this.$('div.leaflet-bottom.leaflet-right').html(attributionHTML);
    },

    listenToBotPosition: function(){
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/bot', function(){});
      });
      io.socket.get('/bot', this.printBot.bind(this));
      io.socket.on('botLocation', this.printBot.bind(this));
    },

    listenToPokemonServerStatus: function(){
      this.$serverStatus = this.$('span.server-status');
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/pokemon-server', function(){});
      });
      io.socket.get('/pokemon-server', this.printServerStatus.bind(this));
      io.socket.on('serverStatus', this.printServerStatus.bind(this));
    },

    printBot: function(bots){
      return;
      // Remove egg functionality until I get a better solution to avoid the bann
      if(!bots) return;
      var botsNames = Object.keys(bots);
      _.each(botsNames, function(botName){
        if(this.markers[botName]) this.map.removeLayer(this.markers[botName]);
        var pokeIcon = new this.MarkerStyle({iconUrl: '/img/pokemons/egg.png'});
        var marker = L.marker([bots[botName].latitude, bots[botName].longitude], {icon: pokeIcon}).addTo(this.map);
        this.markers[botName] = marker;
      }, this);
    },

    printPokemon: function(pokemon){
      var text = '<b>' + pokemon.name + '</b><br>';
      if(pokemon.expiration){
        var date = new Date(pokemon.expiration);
        var hours = date.getHours()
        var minutes = date.getMinutes();
        if(minutes < 10) minutes = '0' + minutes;
        var seconds = date.getSeconds();
        if(seconds < 10) seconds = '0' + seconds;
        var time = hours + ":" + minutes + ":" + seconds;
        text += 'Hasta: <b>' + time + '</b>';
      }
      var pokeIcon = new this.MarkerStyle({iconUrl: '/img/pokemons/' + parseInt(pokemon.num) + '.png'});
      var marker = L.marker([pokemon.latitude, pokemon.longitude], {icon: pokeIcon})
                    .addTo(this.map)
                    .bindPopup(text);
      marker.pokemonId = pokemon.id;
      this.markers[pokemon.id] = marker;
    },

    printServerStatus: function(status){
      if(!this.$serverStatus || !this.$serverStatus.length) return;
      this.$serverStatus.html('Pokemon server: ' + status.toUpperCase() + '&nbsp;');
      if(status === 'online') return this.$serverStatus.css('color', 'green');
      this.$serverStatus.css('color', 'red');
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
