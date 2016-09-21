var express = require("express");
var fs = require("fs");
var util = require("./util");

var app = express();

// Configure Google Analytics and Google Maps
app.locals.gaid = process.env.GAID;
app.locals.gmap = process.env.GMAP;

// Configure templating.
app.set("view engine", "jade");
app.set("views", __dirname + "/../pub");

// Optimize serving the favicon and text content.
app.use(express.favicon(__dirname + "/../pub/favicon.ico"));
app.use(express.compress());

// Log requests.
express.logger.token("date", function () {
	return new Date().toISOString();
});
app.use(express.logger(":date :method :url :status (:response-time ms)"));

// Render and serve the main page.
app.get("/", function (req, res) {
	res.render("index", Vendors);
});

// Filter and serve the vendor data.
app.get("/api/vendors", function (req, res) {
	// Normalize the input.
	var text = util.simplify(req.query.text);
	var type = req.query.type;
	var latlon = [parseFloat(req.query.lat, 10), parseFloat(req.query.lon, 10)];
	var distance = parseFloat(req.query.distance, 10);
	
	// Filter vendors by 1) type 2) distance 3) text.
	// The very simple text search is accomplished by searching for
	// the simplified input in the vendor name and labels.
	var list = Vendors.list.filter(function (v) {
		return (!type || v.type === type) &&
			util.distance(v.latlon, latlon) <= distance &&
			(!text || (util.simplify(v.name) + " " + v.labels.join(" ")).indexOf(text) !== -1);
	});
	
	res.send(list);
});

module.exports = function () {
	var port = process.env.PORT || 5000;
	
	// Load static assets. (See note in README.)
	app.locals.css = fs.readFileSync(__dirname + "/../pub/index.css", "utf-8");
	app.locals.js = fs.readFileSync(__dirname + "/../pub/index.js", "utf-8");
	
	// Listen for requests.
	app.listen(port, function () {
		console.info("serv: listening on port", port);
	});
};