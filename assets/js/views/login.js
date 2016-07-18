$(function(){

  var Login = Backbone.View.extend({

    el: 'div#login-view',

    events: {
      'click button#login': 'doLogin'
    },

    initialize: function(){
      if(!this.$el.length) return this.remove();
      this.$loginBtn = this.$('button#login');
      this.$email    = this.$('input#email');
      this.$password = this.$('input#password');
    },

    doLogin: function(){
      this.$loginBtn.attr('disabled', true);
      var data = {
        email: this.$email.val(),
        password: this.$password.val()
      };
      app.proxy('POST', '/login', data, this.logued, this.error, this);
    },

    logued: function(){
      document.location = '/';
    },

    error: function(err){
      this.$loginBtn.attr('disabled', false);
      var $err = this.$('.error-msg');
      $err.css('visibility', 'visible');
      setTimeout(function(){
        $err.css('visibility', 'hidden');
      }, 3000);
    }

  });

  var login = new Login();

});
