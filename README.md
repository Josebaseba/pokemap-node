# pokemap

This pokemap shows all the pokemons in a certain area/town/city, in real time. The idea is that a bot walks around all the coords inside the location, and all the data that he gets is send to a multiplayer map.

![Pokemap example](/assets/img/pokegif.gif?raw=true)

You can see the the bot position (the moving egg), to check were is it in each moment. You have an admin area, to accepts the requests of the people that want want to use it in your area. If you know how to upload all this project to a server you can make a lot of kids (and not only kids) really happy.

The main core is created using [Sailsjs](http://sailsjs.org/), and the front with [Backbone](http://backbonejs.org/)

## How can I use it?

Requirements: node 6, mongo server, redis server, [MapBox account (free)](https://mapbox.com), [SendGrid account (free)](https://sendgrid.com), and two accounts in pokemonGo, both accounts have to be initialized in pokemonGo (I recommend one via google, and another one via pokeClub, this is a huge improvement of the user experience, because if one of the login type fails automatically the app will try the other login way. That's more uptime to the final user.)

```
git clone https://github.com/Josebaseba/pokemap-node
```

Go to the downloaded folder and:

```
npm install
```

I'm working with node 6, but it should work with node 4 too.

Now get your API keys in sendGrid and in Mapbox, in this last one, check your map and customize it.

Now you need to create a local.js file inside the /config folder, and it should look like this:

```javascript
module.exports = {

  sendGrid: 'SG.123thisISTheSENDGRIDapi',

  mapBox: {
    accessToken: 'pk.mapboxAccessToken',
    mapId: 'user.mapId',
    tileLayer: 'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.mapboxAccessToken',
    attribution: '<span class="small h6 created-by"><span class="server-status"></span> Created by <a href="https://twitter.com/josebaseba" target="_blank">Josebaseba</a></span>'
  },

  // The admin will be created in the first load, if there is no more admins in the DB
  admin: {
    email: 'admin@email.com',
    name : 'SuperAdmin',
    password: 'secretPassword'
  },

  // The coords where the bot is going to start walking
  initialLocation: {
    type: 'coords',
    coords: {
      altitude: 0,
      longitude: -2.73916,
      latitude: 43.22966
    }
  },

  botUsers: [{
    username: 'pokemonLoginUsername',
    password: 'somepass',
    provider: 'ptc', // This is the pokeclub login
    botName : 'rick'
  }, {
    username: 'somegmailaccount@gmail.com',
    password: 'logingooglepass',
    provider: 'google', // Via google
    botName : 'morty'
  }],

  // Which are the bot limits in each cardinal point?
  // The bots walk doing a square in the map, so add your limits:
  botMapCoords: {
    west: -2.73916,
    north: 43.23066,
    east: -2.708366,
    south: 43.21152
  }

};

```

More info about the local.js file: [Sailsjs config](http://sailsjs.org/documentation/concepts/configuration/the-local-js-file)

Now launch your mongo server, `mongod --dbpath=.` and the redis server: `redis-server`. It works with the default values, but you can modify them inside: `config/connections.js`, `config/session.js` and `config/sockets.js`.

I use redis, to store the sessions and the sockets, if we restart the node app, we don't loose the sessions, again, that's huge for the final user. And in mongo we store that pokemons that the bot found, until they get droped from the database, because of the expiration time of each pokemon.

More info about how to configure the databases, sessions and sockets here: [Sails config](http://sailsjs.org/documentation/reference/configuration)

Right now the limit of pokemons that you are going to see the first time that you log in the app is: 300, in my experience that's enougth but if you need more, because the area that you're working with is really huge then modify the `config/blueprints.js` file, changing the `defaultLimit` attribute. More info [blueprints](http://sailsjs.org/documentation/reference/configuration/sails-config-blueprints)

### Notes

All the static content is in spanish right now, you can fork the project and change the language or it would be better if you take a look at this: [http://sailsjs.org/documentation/concepts/internationalization](internationalization).

If you send me a new language I'll accept the pull request as soon as I can.

This project is not really stable, the pokemonGo API is a private API, so who now how long is going to last this project, could be a year, six month, two week or forever and ever.

### Thanks

[Armax](https://github.com/Armax) and his project pokemonGo-node-api.

### Author

[Josebaseba](https://twitter.com/josebaseba), feel free to send me a DM or to open a issue to talk.

### LICENSE

The MIT License (MIT)

Copyright (c) 2016 Joseba Legarreta

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
