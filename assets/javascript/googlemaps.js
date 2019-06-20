//Global Variables to be updated

//to be taken from geoip-db
var localCity = '';
var localState = '';


//to be taken from GoogleMaps
var foundCity = '';
var foundState = '';


$(document).on("click", "#ecobtn", function()
{

  $("#eco").css("display", "block");
  $("#eco").css("visibility", "visible");
  $("#city").css("display", "none");
  $("#city").css("visibility", "hidden");

  
});

$(document).on("click", "#citybtn", function()
{
  $("#eco").css("visibility", "hidden");
  $("#eco").css("display", "none");
  $("#city").css("display", "block");
  $("#city").css("visibility", "visible");  


});

//Ajax call to geoip-db get the city data from geoip-db and define the 'local' variables

function loadLocal() {
  $("#searchSpinner").show();
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
  $('#searchInputLabel-data').val(window.location.search.slice(8)); 
  $("#zillow").attr({href:`https://www.zillow.com/homes/${window.location.search.slice(8)}`, target: "_blank"})
  

  //Calls the function of the search when the page transitions--so that the user's search carries from index.html to data.html
  if (window.location !== "data") {
    // console.log("data");    

    $('#searchButton-data').click(function (event) {  
      event.preventDefault();  
      $("a").attr({href: "https://www.zillow.com/homes/" + $('#searchInputLabel-data').val(), target: "_blank"});                                             
      loadLocal();
      $("#population").empty();             
      $("#annualMedianHomePrice").empty();  
      $("#unemployment").empty();           
      $("#crime").empty();                  
      $("#saleTax").empty();              
    });
  }
});

//Search location function for Google Maps geocoding.

function searchLocation() {
  var geocoder = new google.maps.Geocoder("#map");
  // console.log("click click");

  var address = $('#searchInputLabel-data').val(); 

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
    $("#city").css("visibility", "visible");  
    $("#eco").css("visibility", "visible");

    // console.log(queryURL);
    // console.log(response);

    $("#population").empty();
    $("#annualMedianHomePrice").empty();
    $("#unemployment").empty();
    $("#crime").empty();
    $("#saleTax").empty();

    $("#searchSpinner").hide();    
    
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
    annualHeader.text("Economy");
    $("#annualMedianHomePrice").append(annualHeader);
    $("#annualMedianHomePrice").append(annualImg);
    
    
    var unemployImg = $("<img>");
    var unemployHeader = $("<h2>");
    unemployImg.attr('alt', 'unemployment rate');
    unemployImg.attr('id', 'unemploymentData');
    unemployImg.attr('src', response.unemployed);
    unemployHeader.text("Demographics");
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
    salesTaxHeader.text("Income");
    $("#saleTax").append(salesTaxHeader);
    $("#saleTax").append(salesTaxImg);    
    
  });
};

