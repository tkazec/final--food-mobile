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
// Serialize search parameters and pull results from the API endpoint.
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

// Clear the map and build and display vendor markers.
// Uses immediately-invoked function expressions for cleanly building DOM.
Data.show = function () {
	// Clear the map.
	Map.hideInfoWindows();
	Map.removeMarkers();
	
	// Populate the map.
	Map.addMarkers(Data.list.map(function (v) {
		// Build the info window content.
		var info = document.createElement("div");
		
		info.className = "map-info";
		
		// Add the title.
		info.appendChild(function () {
			var elem = document.createElement("h1");
			elem.textContent = v.name;
			return elem;
		}());
		
		// Add the address.
		info.appendChild(function () {
			var elem = document.createElement("address");
			elem.textContent = v.address;
			return elem;
		}());
		
		// Add the labels after sorting and mapping.
		info.appendChild(function () {
			var elem = document.createElement("ul");
			
			// Add the type as the first label.
			var li = document.createElement("li");
			li.textContent = v.type;
			elem.appendChild(li);
			
			// Sort the labels based on global popularity, then normalize them.
			v.labels.sort(function (a, b) {
				return Labels[b].count - Labels[a].count;
			}).forEach(function (l) {
				var li = document.createElement("li");
				li.textContent = Labels[l].title;
				elem.appendChild(li);
			});
			
			return elem;
		}());
		
		// Add the schedule link.
		info.appendChild(function () {
			var elem = document.createElement("a");
			elem.href = v.schedule;
			elem.target = "_blank";
			elem.textContent = "Open Schedule";
			return elem;
		}());
		
		// Add the Yelp link.
		info.appendChild(function () {
			var elem = document.createElement("a");
			elem.href = "https://www.yelp.com/search?find_desc=" + window.encodeURIComponent(v.name);
			elem.target = "_blank";
			elem.textContent = "Search Yelp";
			return elem;
		}());
		
		// Build the marker.
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
// Monitor the text field.
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

// Monitor the type field.
document.getElementById("top-type").addEventListener("change", function () {
	Search.type = this.value;
	Data.load();
}, false);

// Monitor the address field.
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

// Monitor the distance buttons.
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
// Attemp to find the user.
GMaps.geolocate({
	success: function (pos) {
		Search.latlon = [pos.coords.latitude, pos.coords.longitude];
		Data.load();
		Map.setCenter(pos.coords.latitude, pos.coords.longitude);
		
		document.getElementById("top-address").placeholder = "current location";
	},
	error: function () {}
});

// Load the initial data.
Data.load();