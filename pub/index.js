var map = new GMaps({
	div: "#map-inner",
	lat: 37.7749295,
	lng: -122.4194155,
	zoom: 13
});

GMaps.geolocate({
	success: function (pos) {
		map.setCenter(pos.coords.latitude, pos.coords.longitude);
	}
});