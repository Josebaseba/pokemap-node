$(function(){

  if(!$('div#pokemap').length && !$('div#admin-view').length) return;

  var Me = Backbone.View.extend({

    el: 'div',

    events: {},

    initialize: function(){
      app.proxy('GET', '/me', {}, this.saveSession, this._error, this);
      app.proxy('PUT', '/online', {}, function(){
        if($('div#admin-view').length) Backbone.trigger('loadUsers');
      }, this._error);
    },

    saveSession: function(session){
      app.session = session;
    },

    _error: function(err){
      console.log(err);
    }

  });

  var me = new Me();

});
