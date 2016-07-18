$(function(){

  var Login = Backbone.View.extend({

    el: 'div#signup-view',

    events: {
      'click button#signup': 'doSignup'
    },

    initialize: function(){
      if(!this.$el.length) return this.remove();
      this.$signupBtn = this.$('button#signup');
      this.$name      = this.$('input#name');
      this.$email     = this.$('input#email');
      this.$password  = this.$('input#password');
      this.$message   = this.$('textarea#message');
    },

    doSignup: function(){
      this.$signupBtn.attr('disabled', true);
      var data = {
        name : this.$name.val(),
        email: this.$email.val(),
        password: this.$password.val(),
        message : this.$message.val()
      };
      app.proxy('POST', '/signup', data, this.signedUp, this.error, this);
    },

    signedUp: function(){
      this.$('div.form-container').remove();
      this.$('div.success').show();
    },

    error: function(err){
      this.$signupBtn.attr('disabled', false);
      if(err.status === 409) return alert('Email duplicado!');
      var $err = this.$('.error-msg');
      $err.css('visibility', 'visible');
      setTimeout(function(){
        $err.css('visibility', 'hidden');
      }, 5000);
    }

  });

  var login = new Login();

});
