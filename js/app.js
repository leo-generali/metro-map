

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
         'RD': 'Red',
         'BL': 'Blue',
         'OR': 'Orange',
         'SV': 'Silver',
         'YL': 'Yellow',
         'GR': 'Green',
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
                  lines: [model.Stations[current].LineCode1, model.Stations[current].LineCode2, model.Stations[current].LineCode3, model.Stations[current].LineCode4],
                  title: model.Stations[current].Name,
                  stationCode: model.Stations[current].Code,
                  openInfoWindow: false
               });

               
               var testStr = model.Stations[current].LineCode1;

               //Creates text with information on the Stations name and lines that go through it
               var contentString = 
               '<p class="stationName">' + marker.title + '</p>' + '<div id="content">' + 
               '<p class="stationLine ' + model.Stations[current].LineCode1 + '">' + marker.lines[0] + '</p>' +
               '<p class="stationLine ' + model.Stations[current].LineCode2 + '">' + marker.lines[1] + '</p>' +
               '<p class="stationLine ' + model.Stations[current].LineCode3 + '">' + marker.lines[2] + '</p>' +
               '<p class="stationLine ' + model.Stations[current].LineCode4 + '">' + marker.lines[3] 

               //Gives each station an infowindow that displays the information above
               marker.infowindow = new google.maps.InfoWindow({
                  content: contentString,
                  maxWidth: 150
               });

               //If that marker's infoWindow is NOT open, it will open.
               //If the marker's infoWindow IS open, it will close.
               marker.infoWindowClick = function(){
                  markers.forEach(function(markerElem){
                     markerElem.infowindow.close();
                     this.openInfoWindow = false;
                  });
                  if(!this.openInfoWindow){
                     this.infowindow.open(this.map, this);
                     this.openInfoWindow = true;
                  }else{
                     this.infowindow.close();
                     this.openInfoWindow = false;
                  }
               };

               marker.addListener('click', marker.infoWindowClick);

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

   //Click view infoWindow open
   self.listClick = function(){
      this.infoWindowClick();
   };

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
            self.filteredMapMarkers.push(metroStation);
         }  
      });
   });
}