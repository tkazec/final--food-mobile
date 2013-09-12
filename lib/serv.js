var express = require("express");
var fs = require("fs");
var util = require("./util");

var app = express();

app.locals.gaid = process.env.GAID;

app.set("view engine", "jade");
app.set("views", __dirname + "/../pub");

app.use(express.favicon(__dirname + "/../pub/favicon.ico"));
app.use(express.compress());

express.logger.token("date", function () {
	return new Date().toISOString();
});
app.use(express.logger(":date :method :url :status (:response-time ms)"));

app.get("/", function (req, res) {
	res.render("index", Vendors);
})

app.get("/api/vendors", function (req, res) {
	var text = util.simplify(req.query.text);
	var type = req.query.type;
	var latlon = [parseFloat(req.query.lat, 10), parseFloat(req.query.lon, 10)];
	var distance = parseFloat(req.query.distance, 10);
	
	var list = Vendors.list.filter(function (v) {
		return (!type || v.type === type) &&
			util.distance(v.latlon, latlon) <= distance &&
			(!text || (util.simplify(v.name) + " " + v.labels.join(" ")).indexOf(text) !== -1);
	});
	
	res.send(list);
});

module.exports = function () {
	var port = process.env.PORT || 5000;
	
	app.locals.css = fs.readFileSync(__dirname + "/../pub/index.css", "utf-8");
	app.locals.js = fs.readFileSync(__dirname + "/../pub/index.js", "utf-8");
	
	app.listen(port, function () {
		console.info("serv: listening on port", port);
	});
};