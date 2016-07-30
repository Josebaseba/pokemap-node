$(function(){

  if(!$('div#pokemap').length) return;

  var ContactModal = Backbone.View.extend({

    el: 'div#contact',

    events: {
      'click button#send-form': 'sendForm'
    },

    initialize: function(){
      this.listenTo(Backbone, 'showContactForm', this.showContactForm);
      this.$contact = $('#contact');
      this.$message = $('#message');
      this.$sendBtn = $('#send-form');
      this.$alert = $('.alert-message'); // Simplify doing it globaly
    },

    showContactForm: function(){
      this.$el.modal({show: true, backdrop: true});
    },

    sendForm: function(){
      var message = this.$message.val().trim();
      if(!message || !message.length) return;
      this.$sendBtn.attr('disabled', true);
      var data = {message: message};
      app.proxy('POST', '/message', data, function(){
        this.$el.modal('hide');
        this.$sendBtn.attr('disabled', false);
        this.$message.val('');
        this.showSuccessModal();
      }, this._error, this);
    },

    showSuccessModal: function(){
      var html = '<div class="alert alert-success">\
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>\
        <strong>Mensaje enviado!</strong>\
      </div>';
      this.$alert.html(html);
      var that = this;
      setTimeout(function(){
        that.$alert.html('');
      }, 7500);
    },

    _error: function(err){
      console.error(err);
      this.$sendBtn.attr('disabled', false);
      alert('Error, vuelve a intentarlo');
    }

  });

  var contactModal = new ContactModal();

});
