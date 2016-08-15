/**
 * Pokemon.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  schema: false,

  attributes: {},

  afterCreate: function(values, next){
    var num = parseInt(values.num);
    if(num && sails.config.pokedex[num]){
      MailService.sendPokedexAlert(num, values.expiration, values.createdAt);
    }
    return next();
  }
};
