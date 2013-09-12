var express = require("express");

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
	var latlon = [parseFloat(req.query.lat, 10), parseFloat(req.query.lon, 10)];
	var distance = parseFloat(req.query.distance, 10);
	var type = req.query.type;
	
	var list = Vendors.filter(function (v) {
		return (!type || v.type === type) && distance(v.latlon, latlon) <= distance;
	});
	
	res.send(list);
});

module.exports = function () {
	var port = process.env.PORT || 5000;
	
	app.listen(port, function () {
		console.info("serv: listening on port", port);
	});
};