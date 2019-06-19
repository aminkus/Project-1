//Global Variables to be updated 

//to be taken from geoip-db

var localCity = '';
var localState = '';


//to be taken from GoogleMaps

var foundCity = '';
var foundState = '';





//ajax call to get the city data from geoip-db and define the 'local' variables

function loadLocal() {
  $.ajax({
    url: "https://geoip-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",
    // success: 

    
  }).then(function (location) {
   
    localCity = location.city;
    localState = location.state;
   


  });
};




//GOOGLE MAPS JS//

//Function for geolocation on page load.

var map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
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


// $('#searchButton').click(function(){
//   searchLocation();
//   searchkeilswolfram();
// });
// $('#searchButton').click(function () {
//   // event.preventDefault();
//   searchLocation();
//   console.log(localCity);
//   console.log(localState);
//   console.log(foundCity);
//   console.log(foundState);
// });


$(document).ready(function () {
  loadLocal();
  $('#searchInputLabel').val(window.location.search.slice(8));
  //show progress bar when search is entered
  $(".progress").show();

  if (window.location !== "data") {
    console.log("data");
    //Search for location


    $('#searchButton2').click(function () {
      searchLocation();
      $(".progress").show();
      //searchkeilswolfram();
    });
  }

  setTimeout(function () {
    searchLocation();

    //searchkeilswolfram();
  }, 1000);


});

function searchLocation() {
  var geocoder = new google.maps.Geocoder("#map");
  console.log("click click");

  var address = $('#searchInputLabel').val();

  geocoder.geocode({ 'address': address }, function (results, status) {
    console.log(results);
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

      console.log(foundCity);
      console.log(foundState);

    }
    else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });




};


//Function -- Ajax call for keilswolfram app

function searchkeilswolfram() {

  var queryURL = "https://keilswolframmess.herokuapp.com/?startCity=" + localCity + "&startState=" + localState + "&endCity=" + foundCity + "&endState=" + foundState

  // var  = "https://cors-anywhere.herokuapp.com/" + originalURL

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(queryURL);
    console.log(response);
    //hiding progress bar once data is loaded
    $(".progress").hide();
    $("#population").empty();
    $("#annualMedianHomePrice").empty();
    $("#unemployment").empty();
    $("#crime").empty();
    $("#saleTax").empty();



    var popImg = $("<img>");
    var popHeader = $("<h2>");
    popImg.attr('alt', 'population info');
    popImg.attr('id', 'popData')
    popImg.attr('src', response.pop);
    popHeader.text("Population");
    $("#population").append(popHeader);
    $("#population").append(popImg);


    var annualImg = $("<img>");
    var annualHeader = $("<h2>");
    annualImg.attr('alt', "annual median home price");
    annualImg.attr('id', 'annualMedianHPData');
    annualImg.attr('src', response.medianH);
    annualHeader.text("Annual Home Price");
    $("#annualMedianHomePrice").append(annualHeader);
    $("#annualMedianHomePrice").append(annualImg);


    var unemployImg = $("<img>");
    var unemployHeader = $("<h2>");
    unemployImg.attr('alt', 'unemployment rate');
    unemployImg.attr('id', 'unemploymentData');
    unemployImg.attr('src', response.unemployed);
    unemployHeader.text("Unemployment");
    $("#unemployment").append(unemployHeader);
    $("#unemployment").append(unemployImg);


    var crimeImg = $("<img>");
    var crimeHeader = $("<h2>");
    crimeImg.attr('alt', 'crime rate');
    crimeImg.attr('id', 'crimeData');
    crimeImg.attr('src', response.crime);
    crimeHeader.text("Crime");
    $("#crime").append(crimeHeader);
    $("#crime").append(crimeImg);


    var salesTaxImg = $("<img>");
    var salesTaxHeader = $("<h2>");
    salesTaxImg.attr('alt', 'sales tax');
    salesTaxImg.attr('id', 'salesTaxData');
    salesTaxImg.attr('src', response.sales);
    salesTaxHeader.text("Sales Tax");
    $("#saleTax").append(salesTaxHeader);
    $("#saleTax").append(salesTaxImg);





  });


};


