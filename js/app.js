

//Set up the Map
var markers = [];
var test = [];

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

      //Table that return the long form of 
      var lineHashTable = {
         RD: 'red',
         BL: 'blue',
         OR: 'orange',
         SV: 'silver',
         YL: 'yellow',
         GR: 'green',
         null: 'null'
      };

      //Populates the metro map with every station
      function populateMap(num){
         for(var i = 0; i < num; i++){
            (function(current){

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

               
               var testStr = model.Stations[current].LineCode1;
               console.log(testStr);

               //Creates text with information on the Stations name and lines that go through it
               var contentString = '<div id="content">' + 
               '<p class="stationName">' + marker.title + '</p>' + 
               '<p class="stationLine ' + model.Stations[current].LineCode1 + '">' + marker.line1; + '</p>' +
               '<p class="stationLine ' + model.Stations[current].LineCode2 + '">' + marker.line2; + '</p>' +
               '<p class="stationLine ' + model.Stations[current].LineCode3 + '">' + marker.line3; + '</p>' +
               '<p class="stationLine ' + model.Stations[current].LineCode4 + '">' + marker.line4; 


               //Gives each station an infowindow that displays the information above
               var infowindow = new google.maps.InfoWindow({
                  content: contentString
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

            })(i);
         }
      }

   populateMap(model.Stations.length);

   //Applies KO bindings after markers is populated
   ko.applyBindings(new mapViewModel());
}


function mapViewModel(){

  var self = this;

   self.filteredMapMarkers = ko.observableArray([]);
   self.userInput = ko.observable('');
   self.mapMarkers = ko.observableArray(markers);

   //Since no stations have no characters in them, when the user input is blank, all stations are added to filterMapMarker
   //Once a character is typed, this function looks at all stations and finds out that character is located in it.
   //If that character is inside the function, it is added to filterMapMarker
   self.filterLocations = ko.computed(function(){
   var filter = self.userInput().toLowerCase();

   self.filteredMapMarkers.removeAll();

   self.mapMarkers().forEach(function(metroStation){
   metroStation.setVisible(false);

      if(metroStation.title.toLowerCase().indexOf(filter) !== -1){
         metroStation.setVisible(true);
         self.filteredMapMarkers.push(metroStation)
      }  
   });
  });
}