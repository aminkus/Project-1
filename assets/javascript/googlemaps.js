//Global Variables to be updated 

//to be taken from geoip-db

var localCity = '';  
var localState = ''; 


//to be taken from GoogleMaps

var foundCity = '';
var foundState =''; 





  //ajax call to get the city data from geoip-db and define the 'local' variables
  
  $.ajax({
      url: "https://geoip-db.com/jsonp",
      jsonpCallback: "callback",
      dataType: "jsonp",
      success: function( location ) {
          
          localCity = location.city;
          localState = location.state;
  
      }

      
    }); 
    



//GOOGLE MAPS JS//

//Function for geolocation on page load.

var map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 9
  });
  infoWindow = new google.maps.InfoWindow;

  // // HTML5 geolocation.
  // (navigatorlocation)     

  //LEAVE THIS IN FOR NOW//
  // // HTML5 geolocation.
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     var pos = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };

  //     infoWindow.setPosition(pos);
  //     infoWindow.setContent('Location found.');
  //     infoWindow.open(map);
  //     map.setCenter(pos);
  //   }, function() {
  //     handleLocationError(true, infoWindow, map.getCenter());
  //   });
  // } else {
  //   // Browser doesn't support Geolocation
  //   handleLocationError(false, infoWindow, map.getCenter());

  // }



}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}




//SEARCH FOR LOCATION//


$('#searchButton').click(function(){
  searchLocation();
  searchkeilswolfram();
});

$('#searchButton2').click(function(){
  searchLocation();
  searchkeilswolfram();
});

$( document ).ready(function() {
//Search for location
$('#searchInputLabel').val(window.location.search.slice(8));
searchLocation();
searchkeilswolfram();

});
  
function searchLocation() {
  var geocoder = new google.maps.Geocoder("#map");
  console.log("click click");

  var address = $('#searchInputLabel').val();
  
	geocoder.geocode( { 'address': address}, function(results, status) {
    console.log(results);
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
      foundCity = results[0].address_components[0].long_name;
      foundState = results[0].address_components[2].short_name
      console.log(foundCity);
      console.log(foundState);
      
		} 
		else 
		{
			alert("Geocode was not successful for the following reason: " + status);
		}
  });



};


//Function -- Ajax call for keilswolfram app

function searchkeilswolfram() {

var originalURL = "https://keilswolframmess.herokuapp.com/?startCity=" + localCity + "&startState=" + localState + "&endCity=" + foundCity + "&endState=" + foundState

var queryURL = "https://cors-anywhere.herokuapp.com/" + originalURL

$.ajax({
  url: queryURL,
  method: "GET",
}).then(function(response) {
  console.log(queryURL);
  console.log(response);
 
  $("#population").empty();
  $("#annualMedianHomePrice").empty();
  $("#unemployment").empty();
  $("#crime").empty();
  $("#saleTax").empty();



  var popImg = $("<img>");
  popImg.attr('alt', 'population info');
  popImg.attr('id', 'popData')
  popImg.attr('src', response.pop);
  $("#population").append(popImg);


  var annualImg = $("<img>");
  annualImg.attr('alt',"annual median home price");
  annualImg.attr('id', 'annualMedianHPData');
  annualImg.attr('src', response.medianH);
  $("#annualMedianHomePrice").append(annualImg);

  
  var unemployImg = $("<img>");
  unemployImg.attr('alt', 'unemployment rate');
  unemployImg.attr('id', 'unemploymentData');
  unemployImg.attr('src', response.unemployed);
  $("#unemployment").append(unemployImg);


  var crimeImg = $("<img>");
  crimeImg.attr('alt','crime rate');
  crimeImg.attr('id', 'crimeData');
  crimeImg.attr('src', response.crime);
  $("#crime").append(crimeImg);
  

  var salesTaxImg = $("<img>");
  salesTaxImg.attr('alt', 'sales tax');
  salesTaxImg.attr('id', 'salesTaxData');
  salesTaxImg.attr('src', response.sales);
  $("#saleTax").append(salesTaxImg);





});


};


