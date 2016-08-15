/**
 * Pokemon.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    number: {
      type: 'integer',
      unique: true,
      required: true
    },

    name: 'text',

    img: 'text'

  },

  indexes: [{
    attributes: {
      number: 1
    },
    options: {
      unique: true
    }
  }],

};
