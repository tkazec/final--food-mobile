Food trucks in San Francisco. https://food-mobile.teddy.io

---

Getting started:

	$ git clone https://github.com/tkazec/final--food-mobile.git
	$ npm install
	$ npm start

Environment variables:

* `NODE_ENV`: Node environment to use. Set to `production` for extra caching.
* `PORT`: Port to listen on. Defaults to `5000`.
* `GAID`: Google Analytics account to track.
* `GMAP`: Google Maps parameters.

---

What's food-mobile?

A complete, production-ready web app I created as a demo in about twelve hours. The basic concept is similar to Yelp for food trucks in San Francisco. It's highly optimized for an excellent experience with every device and situation—finding food *now*, or just planning that Monday night excursion to Willow Market.

Built with [Node](https://nodejs.org) running [Express](https://expressjs.com), the server pulls from [DataSF](https://data.sfgov.org/Permitting/Mobile-Food-Facility-Permit/rqzj-sfat), analyzes metadata such as labels, and then serves it to the client via the API endpoint. Rendered by [Jade](https://pugjs.org), the client uses Google Maps with a wrapper library, and some styles and scripts to glue it all together. Taking advantage of some of the latest HTML5 features such as geolocation, it performs well on every recent major browser and platform.

My production instance is running on Heroku, for simplicity and scalability.

---

Decisions...

* Design? I wanted something that look good on every device. I decided on a light, minimalist, Google-inspired theme. The entire UI actually uses the Android system font.
* Database? Normally, I would use something like Redis or MongoDB (or both). Redis would be nice for simple, performant persistence. MongoDB would be nice for full persistence, powerful queries, and features such as geospatial indexing. In this case however, the dataset is relatively small, doesn't need to be persisted, and isn't hard to query. A database would be overkill.
* Statics? I'm directly loading and dumping the CSS and JS into the HTML. Only acceptable here because it will only ever be a single page app, simplifying the server and reducing HTTP requests. In almost any other circumstance though, a static file server and maybe an asset builder should be used.
* Bootstrap? I'm not a fan of its size, given the amount it'd be used here. I wanted a more customized style anyway.
* jQuery? Similar to Bootstrap, it's just so large and wouldn't be very useful in this case. Native DOM works well.

In general, I mostly used my favorite tools here. Node running Express with Jade is hard to beat. [Cron](https://npmjs.org/package/cron) is fairly standard. And while [request](https://npmjs.org/package/request) is currently only used in one place, it's so applicable it'd be weird to leave out.

What I did not have experience with was Google Maps or any of its related APIs and wrapper libraries. I ended up choosing [gmaps.js](https://hpneo.github.io/gmaps/) off of [cdnjs](https://cdnjs.com), and it worked out well.

Future improvements could include realtime vendor integrations, better text search, better label merging (maybe using Levenshtein distance), autocomplete for searching, mobile icons, an informational section, and in-depth error handling and logging.

---

About me:

I’m a full stack web engineer who has dabbled in games. Previously an intern at [Game Closure](http://www.gameclosure.com), I’m now pioneering time-based search at [SpotOn](https://spoton.it). I have experience with and enjoy most things involving web technologies, with a passion for the latest and greatest. Check out my [portfolio](http://tkaz.ec/about.html)!

---

© 2013 [Teddy Cross](http://tkaz.ec), shared under the [MIT License](http://www.opensource.org/licenses/MIT).