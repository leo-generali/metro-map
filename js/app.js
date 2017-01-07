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
         'center': center,
         'mapTypeControl': false
      };

      var map = new google.maps.Map(document.getElementById('map'), options);

      //Station Information
      //var i = 0;

      //Table that return the long form of 
      var lineHashTable = {
         RD: 'red',
         BL: 'blue',
         OR: 'orange',
         SV: 'silver',
         YL: 'yellow',
         GR: 'green',
         null: ''
      };

      //Populates the metro map with every station
   	function populateMap(num){
         for(var i = 0; i < num; i++){
            (function(current){

               // function returnLines(){
               //    var tempLines = '';
               //    if(model.Stations[current].LineCode1 !== null){
               //       console.log(lineHashTable[model.Stations[current].LineCode1]);
               //    }else if(model.Stations[current].LineCode2 !== null){
               //       console.log('line2');
               //    }
               // };

               // returnLines();

               //Helper function that creates colored metro line information
               console.log(lineHashTable[model.Stations[current].LineCode1]);


               //Creates text with information on the Stations name and lines that go through it
               var contentString = '<div id="content">' + 
               '<p class="stationName">' + model.Stations[current].Name + '</p>' +
               '<p class="stationLine red">' + 
               model.Stations[current].LineCode1 + ' ' + 
               model.Stations[current].LineCode2 + ' ' +
               model.Stations[current].LineCode3 + ' ' +
               model.Stations[current].LineCode4;

               var infowindow = new google.maps.InfoWindow({
                  content: contentString
               });

               console.log(model.Stations[current].Name);

               //Places marker on map
               var latLng = new google.maps.LatLng(model.Stations[current].Lat, model.Stations[current].Lon);
               var marker = new google.maps.Marker({
                  position: latLng,
                  map: map,
                  line1: model.Stations[current].LineCode1,
                  line2: model.Stations[current].LineCode2,
                  line3: model.Stations[current].LineCode3,
                  line4: model.Stations[current].LineCode4,
                  title: model.Stations[current].Name

               });

               //Opens infowindow containing contentString when the marker is clicked
               marker.addListener('click', function(){
                  infowindow.open(map, marker);
               });

               marker.addListener('click', function(){
                  this.setAnimation(google.maps.Animation.BOUNCE);
                  setTimeout(function(){
                     marker.setAnimation(null);
                  }, 728);
               });

               markers.push(marker);

            })(i)
         }
   	}
   populateMap(model.Stations.length);
}

function mapViewModel(){



   ko.applyBindings(new mapViewModel());
}