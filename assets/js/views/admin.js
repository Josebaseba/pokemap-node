$(function(){

  if(!$('div#admin-view').length) return;

  var Admin = Backbone.View.extend({

    el: 'div#admin-view',

    events: {},

    initialize: function(){
      this.$users = this.$('tbody.users');
      this.$totalUsers = this.$('span.total-users');
      this.$connected = this.$('span.total-connected');
      this.listenTo(Backbone, 'loadUsers', this.loadUsers);
      io.socket.get('/connections', this.connectedPeople.bind(this));
      io.socket.on('connectedUsers', this.connectedPeople.bind(this));
    },

    /* NOT ONLY USERS, ALL THE PEOPLE VISITING THE WEB */
    connectedPeople: function(num){
      this.$connected.text(num);
    },

    loadUsers: function(){
      /* AVOID SERVER CRASH LOST SOCKET :( */
      io.socket.on('connect', function(){
        io.socket.get('/user', function(){});
      });
      io.socket.get('/user', this.suscribeToUsers.bind(this));
      io.socket.on('user', this.userEvent.bind(this));
    },

    suscribeToUsers: function(users){
      this.users = new app.UserCollection(users);
      this.users.each(function(user){
        var userView = new app.UserView({model: user});
        this.$users.append(userView.render().el);
      }, this);
      this.printTotalUsers(this.users.length);
    },

    userEvent: function(event){
      if(event.verb === 'created') return this.createUser(event.data);
      if(!this.users) return;
      var user = this.users.findWhere({id: event.id});
      if(user) user.set(event.data);
    },

    createUser: function(user){
      if(!this.users){
        this.users = new app.UserCollection(user);
        this.printTotalUsers(this.users.length);
        return this.users.each(this.printNewUser, this);
      }
      var user = this.users.add(user);
      this.printTotalUsers(this.users.length);
      this.printNewUser(user);
    },

    printNewUser: function(user){
      var userView = new app.UserView({model: user});
      this.$users.prepend(userView.render().el);
    },

    printTotalUsers: function(totalUsers){
      this.$totalUsers.text(totalUsers);
    }

  });

  var admin = new Admin();

});
