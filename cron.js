var cron = require("cron");
var request = require("request");

var util = require("./util");

module.exports = function () {
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
			
			var labels = util.normalize(v.fooditems).match(/\b[\w\s]+\b/g);
			
			labels.forEach(function (v) {
				data.labels[v] = (data.labels[v] || 0) + 1;
			});
			
			return {
				name: v.applicant,
				type: v.facilitytype,
				labels: labels,
				address: v.address ? util.normalize(v.address) : util.normalize(v.locationdescription),
				latlon: [v.latitude, v.longitude],
				schedule: v.schedule
			};
		});
		
		data.types = Object.keys(data.types);
		
		global.Vendors = data;
		
		console.log("cron: successfully processed", data.list.length, "vendors");
	});
};

new cron.CronJob("00 00 00 * * *", module.exports, null, true);