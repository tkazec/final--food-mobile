var cron = require("cron");
var request = require("request");

var normalize = function (str) {
	return str.toLowerCase().replace(/\d+/g, function (sub) {
		return parseInt(sub, 10);
	}).replace(/\w+/g, function (sub) {
		return sub[0].toUpperCase() + sub.slice(1);
	});
};

var refresh = function () {
	request.get("http://data.sfgov.org/resource/rqzj-sfat.json", function (err, res, txt) {
		if (err) {
			return console.log("cron: http request failed with", err);
		}
		
		try {
			var list = JSON.parse(txt);
		} catch (err) {
			return console.log("cron: json parse failed with", err);
		}
		
		var data = {
			types: {},
			labels: {}
		};
		
		data.list = list.filter(function (v) {
			return v.status === "APPROVED";
		}).map(function (v) {
			data.types[v.facilitytype] = true;
			
			var labels = normalize(v.fooditems).match(/\b[\w\s]+\b/g);
			
			labels.forEach(function (v) {
				data.labels[v] = (data.labels[v] || 0) + 1;
			});
			
			return {
				name: v.applicant,
				address: v.address ? normalize(v.address) : normalize(v.locationdescription),
				latlon: [v.latitude, v.longitude],
				labels: labels,
				schedule: v.schedule
			};
		});
		
		data.types = Object.keys(data.types);
		
		global.Data = data;
	});
};

new cron.CronJob('00 00 00 * * *', refresh, null, true);

refresh();