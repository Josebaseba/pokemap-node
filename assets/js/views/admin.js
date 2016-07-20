$(function(){

  if(!$('div#admin-view').length) return;

  var Admin = Backbone.View.extend({

    el: 'div#admin-view',

    events: {},

    initialize: function(){
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/user', this.suscribeToUsers);
      });
      io.socket.get('/user', this.suscribeToUsers);
      io.socket.on('user', this.userEvent);
    },

    suscribeToUsers: function(users, jwres){
      console.log(users, jwres, 'SUB USER');
      this.users = new app.UserCollection(users);
    },

    userEvent: function(event){
      console.log('USER EVENT', event);
    }

  });

  var admin = new Admin();

});
