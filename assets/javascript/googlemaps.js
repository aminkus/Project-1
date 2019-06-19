//Global Variables to be updated

//to be taken from geoip-db

var localCity = '';
var localState = '';


//to be taken from GoogleMaps

var foundCity = '';
var foundState = '';





//Ajax call to geoip-db get the city data from geoip-db and define the 'local' variables

function loadLocal() {
  $("#searchSpinner").show();  //TODO: CA new
  $.ajax({
    url: "https://geoip-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",


  }).then(function (location) {

    localCity = location.city;
    localState = location.state;
    searchLocation();

  });
};




//GOOGLE MAPS JS//

//Function for initializing geolocation display in Google Maps element

var map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 9
  });
  infoWindow = new google.maps.InfoWindow;



}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}




//SEARCH FOR LOCATION//

//On data.html page load, local variables should be loaded, user input string should be saved, and a search URL should be generated based on the local variables and search word variables.

$(document).ready(function () {
  loadLocal();
  $('#searchInputLabel-data').val(window.location.search.slice(8)); //TODO: CA renamed search input

  //Calls the function of the search when the page transitions--so that the user's search carries from index.html to data.html
  if (window.location !== "data") {
    // console.log("data");
    

    $('#searchButton-data').click(function (event) {  //TODO: CA renamed button and added event
      event.preventDefault();                         //TODO: CA new
      loadLocal();
      $("#population").empty();             //TODO: CA moved from searchkeilswolfram() so div clears immediately
      $("#annualMedianHomePrice").empty();  //TODO: CA moved from searchkeilswolfram()
      $("#unemployment").empty();           //TODO: CA moved from searchkeilswolfram()
      $("#crime").empty();                  //TODO: CA moved from searchkeilswolfram()
      $("#saleTax").empty();                //TODO: CA moved from searchkeilswolfram()
    });
  }



});

//Search location function for Google Maps geocoding.

function searchLocation() {
  var geocoder = new google.maps.Geocoder("#map");
  // console.log("click click");

  var address = $('#searchInputLabel-data').val(); //TODO: CA renamed search input

  geocoder.geocode({ 'address': address }, function (results, status) {
    // console.log(results);
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      if (marker)
        marker.setMap(null);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        draggable: true
      });
      foundCity = results[0].address_components[0].long_name;
      foundState = results[0].address_components[2].long_name
      searchkeilswolfram();

      // console.log(foundCity);
      // console.log(foundState);

    }
    else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });




};


//Function -- Ajax call for keilswolfram app & display information on html

function searchkeilswolfram() {

  var queryURL = "https://keilswolframmess.herokuapp.com/?startCity=" + localCity + "&startState=" + localState + "&endCity=" + foundCity + "&endState=" + foundState

 

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // console.log(queryURL);
    // console.log(response);
    
    //$("#population").empty();             //TODO: CA moved this to search button click event
    //$("#annualMedianHomePrice").empty();  //TODO: CA moved this to search button click event 
    //$("#unemployment").empty();           //TODO: CA moved this to search button click event
    //$("#crime").empty();                  //TODO: CA moved this to search button click event
    //$("#saleTax").empty();                //TODO: CA moved this to search button click event
    
    $("#searchSpinner").hide();             //TODO: CA new
    
    
    var popImg = $("<img>");
    popImg.attr('alt', 'population info');
    popImg.attr('id', 'popData')
    popImg.attr('src', response.pop);
    $("#population").append(popImg);
    
    
    var annualImg = $("<img>");
    annualImg.attr('alt', "annual median home price");
    annualImg.attr('id', 'annualMedianHPData');
    annualImg.attr('src', response.medianH);
    $("#annualMedianHomePrice").append(annualImg);
    
    
    var unemployImg = $("<img>");
    unemployImg.attr('alt', 'unemployment rate');
    unemployImg.attr('id', 'unemploymentData');
    unemployImg.attr('src', response.unemployed);
    $("#unemployment").append(unemployImg);
    
    
    var crimeImg = $("<img>");
    crimeImg.attr('alt', 'crime rate');
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


