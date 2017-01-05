//Udacity Final Project

//Gets metro station data from WMATA API
// var trainData;

// function saveMetroData(){
// 	trainData = JSON.parse(this.responseText);
// 	console.log(trainData);
// }

// function transferFailed(){
// 	console.log('An error occured during the API call.');
// }

// function transferCanceled(){
// 	console.log('The user canceled the request.');
// }

// var trainStationRequest = new XMLHttpRequest();
// trainStationRequest.addEventListener('load', saveMetroData);
// trainStationRequest.addEventListener("error", transferFailed);
// trainStationRequest.addEventListener("abort", transferCanceled);
// trainStationRequest.open('GET', 'https://api.wmata.com/Rail.svc/json/jStations?api_key=1371dab10bc845bea40ef0d8f9aae1cf', true);
// trainStationRequest.send();

//Set up the Map

var markers = [];

function initializeMap() {
      //Creates the map of the DMV
      var centerLat = 38.8951100;
      var centerLng = -77.0363700;
      var center = new google.maps.LatLng(centerLat, centerLng);

      var options = {
         'zoom': 12,
         'center': center
      };

      var map = new google.maps.Map(document.getElementById('map'), options);

      //Station Information
      //var i = 0;




      //Populates the metro map with every station
   	function populateMap(num){
         for(var i = 0; i < num; i++){
            (function(current){

               //Creates text with information on the Stations name and lines that go through it
               var contentString = '<b>Station: </b>' + model.Stations[current].Name + '<br>' + '<b>Line: </b>' + model.Stations[current].LineCode1;

               var infowindow = new google.maps.InfoWindow({
                  content: contentString
               });

               console.log(model.Stations[current].Name);


               //Places marker on map
               var latLng = new google.maps.LatLng(model.Stations[current].Lat, model.Stations[current].Lon);
               var marker = new google.maps.Marker({
                  position: latLng,
                  map: map,
                  title: model.Stations[current].Name
               });

               //Opens infowindow containing contentString when the marker is clicked
               marker.addListener('click', function(){
                  infowindow.open(map, marker);
               });

               markers.push(marker);

            })(i)
         }
   	}
   	populateMap(model.Stations.length);
}