//GOOGLE MAPS JS//

//Function for geolocation on page load.

var map, infoWindow;


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 9
  });
  infoWindow = new google.maps.InfoWindow;

  // HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());

  }






}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


//Search for location

$('#searchButton').click(function () {
  var geocoder = new google.maps.Geocoder("#map");
  console.log("click click");

  var address = $('#searchInputLabel').val();
  
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) 
		{
      map.setCenter(results[0].geometry.location);
        if(marker)
        marker.setMap(null);
			var marker = new google.maps.Marker({
				map: map, 
        position: results[0].geometry.location,
        draggable: true
			});
		} 
		else 
		{
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
});




//Get a variable with the actual city string for WolframAlpha:

//ajax call to get the city data from geoip-db

$.ajax({
    url: "https://geoip-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",
    success: function( location ) {
        $('#country').html(location.country_name);
        $('#state').html(location.state);
        $('#city').html(location.city);  //use this one to get the city name
        $('#latitude').html(location.latitude);
        $('#longitude').html(location.longitude);
        $('#ip').html(location.IPv4);  
    }
}); 


