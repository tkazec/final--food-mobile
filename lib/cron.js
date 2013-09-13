var cron = require("cron");
var request = require("request");

var util = require("./util");

module.exports = function () {
	request.get("http://data.sfgov.org/resource/rqzj-sfat.json", function (err, res, txt) {
		if (err) {
			return console.error("cron: http request failed with", err);
		}
		
		try {
			var list = JSON.parse(txt);
		} catch (err) {
			return console.error("cron: json parse failed with", err);
		}
		
		var data = {
			types: {},
			labels: {}
		};
		
		// Filter and analyze the list of vendors.
		data.list = list.filter(function (v) {
			return v.status === "APPROVED";
		}).map(function (v) {
			// Track the type.
			data.types[v.facilitytype] = true;
			
			// Analyze the labels. Store simplified labels in the vendor,
			// and normalized labels in a stack for later use.
			var labels = util.normalize(v.fooditems).match(/\b[\w\s\-]+\b/g).map(function (l) {
				var key = util.simplify(l);
				data.labels[key] = (data.labels[key] || []).concat(l);
				return key;
			});
			
			// Build the vendor.
			return {
				name: v.applicant,
				type: v.facilitytype,
				labels: labels,
				address: v.address ? util.normalize(v.address) : util.normalize(v.locationdescription),
				latlon: [v.latitude, v.longitude],
				schedule: v.schedule
			};
		});
		
		// Extract the final types.
		data.types = Object.keys(data.types);
		
		// Extract the final labels.
		Object.keys(data.labels).forEach(function (l) {
			var frq = {};
			var max = 0;
			var top = "";
			
			// Analyze frequencies to find the "correct" normalization.
			data.labels[l].forEach(function (t) {
				frq[t] = (frq[t] || 0) + 1;
				
				if (frq[t] > max) {
					max = frq[t];
					top = t;
				}
			});
			
			// Store the final normalization and count for later use.
			data.labels[l] = {
				title: top,
				count: data.labels[l].length
			};
		});
		
		// Globalize the final vendor data.
		global.Vendors = data;
		
		console.info("cron: vendor processing succeeded with", data.list.length);
	});
};

// Run every day at 12am.
new cron.CronJob("00 00 00 * * *", module.exports, null, true);