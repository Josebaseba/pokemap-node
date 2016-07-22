$(function(){

  if(!$('div#pokemap').length && !$('div#admin-view').length) return;

  var Me = Backbone.View.extend({

    el: 'div#status',

    events: {},

    initialize: function(){
      app.proxy('GET', '/me', {}, this.saveSession, this._error, this);
      app.proxy('PUT', '/online', {}, function(){
        if($('div#admin-view').length) Backbone.trigger('loadUsers');
      }, this._error);
      this.listenToPokemonServerStatus();
    },

    saveSession: function(session){
      app.session = session;
    },

    listenToPokemonServerStatus: function(){
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/pokemon-server', function(){});
      });
      io.socket.get('/pokemon-server', this.emitStatus.bind(this));
      io.socket.on('serverStatus', this.emitStatus.bind(this));
    },

    emitStatus: function(status){
      Backbone.trigger('serverStatus', status);
    },

    _error: function(err){
      console.log(err);
    }

  });

  var me = new Me();

});
