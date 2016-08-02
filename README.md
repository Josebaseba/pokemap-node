# pokemap

This pokemap shows all the pokemons in a certain area/town/city, in real time. The idea is that a bot walks around all the coords inside the location, and all the data that he gets is sent to a multiplayer map.

![Pokemap example](/assets/img/pokegif.gif?raw=true)

You can see the the bot position (the moving egg), to check were is it in each moment. You have an admin area, to accepts the requests of the people that want want to use it in your area. In the first connection you get the pokemons that still in the area.

## How can I use it?

Requirements: node 6, mongo server, redis server, [Carto account (free)](https://carto.com), [SendGrid account (free)](https://sendgrid.com), and two accounts in pokemonGo, both accounts have to be initialized in pokemonGo. Right now I realized that the google accounts goes much more faster with the requests, I don't know why, but my two bots are faster with google. You can create as much bots as you want in your local.js file, but each `botName` attribute must be different.

The backend is created using [Sails](http://sailsjs.org/), and the frontend with [Backbone](http://backbonejs.org/)

[Update] Niantic is blocking the AWS servers and DigitalOcean servers as far as I know. You'll need to find another servers provider, but you can use it at home. Maybe some day they'll become nice again with the developers...

```
git clone https://github.com/Josebaseba/pokemap-node
```

Go to the downloaded folder and:

```
sudo npm install
```

I'm working with node 6, but it should work with node 4 too.

Now get your API keys in sendGrid and in Carto, in this last one, check your map and customize it.

Now you need to create a local.js file inside the /config folder, and it should look like this:

```javascript
module.exports = {

  sendGrid: 'SG.123thisISTheSENDGRIDapi',

  carto: {
    viz: 'https://xxxxx.carto.com/api/v2/viz/234235532-53fd-235-bd93-345345/viz.json',
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
    botName : 'rick', // Required unique
    // Which are the bot limits in each cardinal point?
    // The bots walk doing a square in the map, so add your limits:
    mapCoords: {
      west: -2.740102,
      north: 43.219348,
      east: -2.725081,
      south: 43.214555
    }
  }, {
    username: 'somegmailaccount@gmail.com',
    password: 'logingooglepass',
    provider: 'google', // Via google
    botName : 'morty', // Required unique
    reverse : true, // Walks in the opposite direction
    botMapCoords: {
      west: -2.73916,
      north: 43.23066,
      east: -2.708366,
      south: 43.21152
   }
  }],


};

```

More info about the local.js file: [Sailsjs config](http://sailsjs.org/documentation/concepts/configuration/the-local-js-file)

Change `/assets/js/views/map.js` line [32](https://github.com/Josebaseba/pokemap-node/blob/master/assets/js/views/map.js#L32) with your town coords, the center of the town.

After that, go to `views/emails/reset.ejs` and `views/emails/welcome.ejs`, and change the href="" attributes to your future URL.

Now launch your mongo server, `mongod --dbpath=.` and the redis server: `redis-server`. It works with the default values, but you can modify them inside: `config/connections.js`, `config/session.js` and `config/sockets.js`.

I use redis, to store the sessions and the sockets, if we restart the node app, we don't loose the sessions, again, that's huge for the final user. And in mongo we store that pokemons that the bot found, until they get droped from the database, because of the expiration time of each pokemon.

More info about how to configure the databases, sessions and sockets here: [Sails config](http://sailsjs.org/documentation/reference/configuration)

To launch the app:

```
npm start
```

Right now the limit of pokemons that you are going to see the first time that you log in the app is: 300, in my experience that's enough but if you need more, because the area that you're working with is really huge then modify the `config/blueprints.js` file, changing the `defaultLimit` attribute. More info [blueprints](http://sailsjs.org/documentation/reference/configuration/sails-config-blueprints)

To launch it ina  production environment, generate a `config/env/production.js` file: 

```javascript
/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  port: 1337,

  log: {
    level: "info"
  },

  blueprints: {
    shortcuts: false // THIS IS MANDATORY FOR SECURITY REASONS
  },

  connections: {
    mongodb: {
      adapter: 'sails-mongo',
      host: 'yourmongoip',
      port: 27017,
      user: 'pokemaping',
      password: 'uieguirgunernug',
      database: 'pokemaper'
    }
  },

  session: {
    host: 'yourredisip',
    port: 6379,
    pass: 'P98oZx}p',
    prefix: 'sess:'
  },

  sockets: {
    host: 'yourredisip',
    port: 6379,
    pass: 'KuKWeZpht9T8@,L>WLtCqbMUzhJ9P98oZx}p'
  }

};

```

And launch the app with:

```
NODE_ENV=production node app.js
```

### Notes

When you login as a admin, if you go to localhost:1337/admin or http://yoururl/admin to manage the new users. When you accept I new one, he'll get the password to login into the app.

The activation emails don't work in development environment. Comment the following lines to avoid that:

```javascript
// api/services/MailService.js file

// line 11
if(sails.config.environment !== 'production') return; // comment this

// line 43
if(sails.config.environment !== 'production') return; // comment this
```

Or use the NODE_ENV=production flag to test it.

All the static content is in spanish right now, you can fork the project and change the language or it would be better if you take a look at this: [http://sailsjs.org/documentation/concepts/internationalization](internationalization).

If you send me a new language I'll accept the pull request as soon as I can.

This project is not really stable, the pokemonGo API is a private API, so who now how long is going to last this project, could be a year, six month, two week or forever and ever.

If you're going to use the app somewhere, and if you open it to more kids, send me a message because I'll love to know it!

### Uploading to a server

Install nginx, redis, mongo, node, npm, and node-forever.

Nginx config:

```
nano /etc/nginx/conf.d/default.conf
```

```
server {
  listen 80;
  server_name yourdomain.com;

  location / {
    proxy_pass http://localhost:1337/;
    proxy_set_header Host $host;
    proxy_buffering off;
    proxy_set_header X-Real-IP $remote_addr;
    client_max_body_size 50M;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_set_header  X-NginX-Proxy    true;
  }

  location ~* \.(jpg|jpeg|gif|png|ico|css|zip|pdf|txt|mp3|wav|bmp|doc|js|html|htm|eot|svg|ttf|woff|otf|woff2|map)$ {
    access_log off;
    expires max;
    root /projecturl/.tmp/public;
  }

}
```

```
sudo npm install -g forever
```

In your project folder:

```
NODE_ENV=production forever start app.js
```

In production launch it always with the NODE_ENV=production flag!

### TO-DO

Be able to choose which pokemon do you want, and if the pokemon appears in your town you'll get an email alert with the location and the time that you have to get it.

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
