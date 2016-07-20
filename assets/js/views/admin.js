$(function(){

  if(!$('div#admin-view').length) return;

  var Admin = Backbone.View.extend({

    el: 'div#admin-view',

    events: {

    },

    initialize: function(){
      this.$users = this.$('tbody.users');
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/user', function(){});
      });
      io.socket.get('/user', this.suscribeToUsers.bind(this));
      io.socket.on('user', this.userEvent.bind(this));
    },

    suscribeToUsers: function(users, jwres){
      console.log(users, jwres, 'SUB USER');
      this.users = new app.UserCollection(users);
      this.users.each(function(user){
        var userView = new app.UserView({model: user});
        this.$users.append(userView.render().el);
      }, this);
    },

    userEvent: function(event){
      if(!this.users) return;
      var user = this.users.findWhere({id: event.id});
      if(user) user.set(event.data);
    }

  });

  var admin = new Admin();

});
