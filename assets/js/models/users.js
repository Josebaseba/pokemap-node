$(function(){

  app.UserModel = Backbone.Model.extend({

    defaults: {
      name: '',
      email: 'default@email.com',
      actived: false,
      admin: false,
      message: '',
      status: 'offline',
      createdAt: ''
    },

    sync: function(){
      return false;
    }

  });

  app.UserCollection = Backbone.Collection.extend({

    model: app.UserModel,

    comparator: function(model){
      return - new Date(model.get('createdAt')).getTime();
    }

  });

});
