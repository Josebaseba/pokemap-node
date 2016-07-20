$(function(){

  if(!$('div#admin-view').length) return;

  app.UserView = Backbone.View.extend({

    tagName: 'tr',

    className: 'user-row',

    template: _.template($('script.user').html()),

    events: {
      'click button.edit-activation': 'editActivation'
    },

    initialize: function(){
      this.model.on('change', this.render, this);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    destroy: function(){
      this.remove();
    },

    editActivation: function(){
      this.$('button.edit-activation').attr('disabled', true);
      if(this.model.get('actived')){
        return app.proxy('PUT', '/user/' + this.model.get('id'), {actived: false}, function(){}, this._error, this);
      }
      app.proxy('PUT', '/user/' + this.model.get('id'), {actived: true}, function(){}, this._error, this);
    },

    _error: function(){
      this.$('button.edit-activation').attr('disabled', false);
    }

  });

});
