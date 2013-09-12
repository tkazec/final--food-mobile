///////////////////////////////////////////////////////////////////////////////
// Globals
///////////////////////////////////////////////////////////////////////////////
var Search = {
	text: "",
	type: "",
	latlon: [37.7749295, -122.4194155],
	distance: 4.5
};

var Data = {
	list: []
};

var Map = new GMaps({
	div: "#map-inner",
	lat: Search.latlon[0],
	lng: Search.latlon[1],
	zoom: 13
});


///////////////////////////////////////////////////////////////////////////////
// Controls
///////////////////////////////////////////////////////////////////////////////
Data.load = function () {
	var xhr = new XMLHttpRequest();
	var query = [
		"text=" + window.encodeURIComponent(Search.text),
		"type=" + window.encodeURIComponent(Search.type),
		"lat=" + Search.latlon[0],
		"lon=" + Search.latlon[1],
		"distance=" + Search.distance
	];
	
	xhr.onload = function () {
		Data.list = JSON.parse(this.responseText);
		Data.show();
	};
	
	xhr.open("GET", "api/vendors?" + query.join("&") + "&" + Date.now(), true);
	xhr.send();
};

Data.show = function () {
	Map.hideInfoWindows();
	Map.removeMarkers();
	
	Map.addMarkers(Data.list.map(function (v) {
		var info = document.createElement("div");
		
		info.className = "map-info";
		
		info.appendChild(function () {
			var elem = document.createElement("h1");
			elem.textContent = v.name;
			return elem;
		}());
		
		info.appendChild(function () {
			var elem = document.createElement("address");
			elem.textContent = v.address;
			return elem;
		}());
		
		info.appendChild(function () {
			var elem = document.createElement("ul");
			[v.type].concat(v.labels).forEach(function (l) {
				var li = document.createElement("li");
				li.textContent = l;
				elem.appendChild(li);
			});
			return elem;
		}());
		
		info.appendChild(function () {
			var elem = document.createElement("a");
			elem.href = v.schedule;
			elem.target = "_blank";
			elem.textContent = "Open Schedule";
			return elem;
		}());
		
		info.appendChild(function () {
			var elem = document.createElement("a");
			elem.href = "http://www.yelp.com/search?find_desc=" + window.encodeURIComponent(v.name);
			elem.target = "_blank";
			elem.textContent = "Search Yelp";
			return elem;
		}());
		
		return {
			lat: v.latlon[0],
			lng: v.latlon[1],
			details: {
				title: v.name + " [" + v.type + "]"
			},
			infoWindow: {
				content: info
			}
		};
	}));
};


///////////////////////////////////////////////////////////////////////////////
// Events
///////////////////////////////////////////////////////////////////////////////
document.getElementById("top-text").addEventListener("change", function () {
	Search.text = this.value;
	Data.load();
}, false);
document.getElementById("top-text").addEventListener("focus", function () {
	this.placeholder = "e.g. coffee, tacos, ice cream, etc.";
}, false);
document.getElementById("top-text").addEventListener("blur", function () {
	this.placeholder = "everything";
}, false);

document.getElementById("top-type").addEventListener("change", function () {
	Search.type = this.value;
	Data.load();
}, false);

document.getElementById("top-address").addEventListener("change", function () {
	GMaps.geocode({
		address: this.value,
		callback: function (res, err) {
			if (err !== "OK") {
				return;
			}
			
			res = res[0].geometry.location;
			res = [res.lat(), res.lng()];
			
			Search.latlon = res;
			Data.load();
			Map.setCenter(res[0], res[1]);
		}
	});
}, false);

document.getElementById("top-distance").addEventListener("click", function (e) {
	if (e.target && e.target.nodeName === "BUTTON") {
		document.querySelector("#top-distance > button[disabled]").disabled = false;
		e.target.disabled = true;
		
		Search.distance = e.target.dataset.distance;
		Data.load();
	}
}, false);


///////////////////////////////////////////////////////////////////////////////
// Setup
///////////////////////////////////////////////////////////////////////////////
GMaps.geolocate({
	success: function (pos) {
		Search.latlon = [pos.coords.latitude, pos.coords.longitude];
		Data.load();
		Map.setCenter(pos.coords.latitude, pos.coords.longitude);
	},
	error: function () {}
});

Data.load();