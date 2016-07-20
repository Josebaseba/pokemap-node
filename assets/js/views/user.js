$(function(){

  if(!$('div#admin-view').length) return;

  app.UserView = Backbone.View.extend({

    tagName: 'div',

    className: 'row user-container',

    template: _.template($('script.user').html()),

    events: {},

    initialize: function(){

    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    destroy: function(){
      this.remove();
    }

  });

});
