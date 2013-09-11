module.exports.normalize = function (str) {
	return str.toLowerCase().replace(/\d+/g, function (sub) {
		return parseInt(sub, 10);
	}).replace(/\w+/g, function (sub) {
		return sub[0].toUpperCase() + sub.slice(1);
	});
};

module.exports.distance = function (a, b) {
	var deg = Math.PI / 180;
	
	var dlat = (b[0] - a[0]) * deg;
	var dlon = (b[1] - a[1]) * deg;
	
	var c =
		Math.sin(dlat / 2) * Math.sin(dlat / 2) +
		Math.sin(dlon / 2) * Math.sin(dlon / 2) *
		Math.cos(a[1] * deg) * Math.cos(b[1] * deg);
	
	return 3959 * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
};