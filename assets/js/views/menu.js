$(function(){

  if(!$('div#pokemap').length) return;

  var Menu = Backbone.View.extend({

    el: 'div#menu',

    events: {
      'click button.refresh': 'refreshPokemons',
      'click button.contact': 'showContactForm'
    },

    initialize: function(){
      this.$refresh = this.$('button.refresh');
      this.$refreshIcon = this.$('button.refresh i.glyphicon');
      this.$alert = $('.alert-message'); // Simplify doing it globaly
    },

    refreshPokemons: function(){
      this.$refresh.attr('disabled', true);
      this.$refreshIcon.addClass('rotating');
      var that = this;
      Backbone.trigger('refreshPokemons', function(err){
        if(!err) that.showSuccessModal();
        that.$refreshIcon.removeClass('rotating');
        that.$refresh.attr('disabled', false);
      });
    },

    showSuccessModal: function(){
      var html = '<div class="alert alert-success">\
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>\
        <strong>Mapa actualizado!</strong> Estás viendo todos los pokemons.\
      </div>';
      this.$alert.html(html);
      var that = this;
      setTimeout(function(){
        that.$alert.html('');
      }, 7500);
    },

    showContactForm: function(){
      // TODO: Send email to admin
    }

  });

  var menu = new Menu();

});
