

//Set up the Map
var markers = [];
var test = [];
addIncidents();

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

      //Overlays the metro rail lines
      map.data.loadGeoJson('http://opendata.dc.gov/datasets/ead6291a71874bf8ba332d135036fbda_58.geojson');


      //Colors each netrorail per it's color
      map.data.setStyle(function(feature){
         var lineColor = feature.getProperty('NAME');
         if(lineColor === 'orange - rush +' || lineColor === 'yellow - rush +'){
            return{
               strokeWeight: 0
            };
         }
         else{
            return{
               strokeColor: lineColor,
               strokeOpacity: 0.8
            };
         }
      });  

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
                  address: model.Stations[current].Address['Street'] + ', ' + model.Stations[current].Address['City'] + ' ' + model.Stations[current].Address['State'],
                  openInfoWindow: false
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

               marker.updateRailPredictions = function(){
                  getRailInfo(this.stationCode);
               };
               
               //Creates text with information on the Stations name and lines that go through it
               marker.createInitialContentString = function(){
                  var contentString = 
                  '<p class="stationName">' + marker.title + '</p>' + '<p class="stationAddress">' + marker.address + '</p>' + 
                  '<h4 class="metroStationsServed">Metro Stations Served</h4>' + '<div id="content">' + 
                  '<p class="stationLine ' + marker.lines[0] + '">' + marker.lines[0] + '</p>' +
                  '<p class="stationLine ' + marker.lines[1] + '">' + marker.lines[1] + '</p>' +
                  '<p class="stationLine ' + marker.lines[2] + '">' + marker.lines[2] + '</p>' +
                  '<p class="stationLine ' + marker.lines[3] + '">' + marker.lines[3] + '</p>'
   
                  this.infowindow = new google.maps.InfoWindow({
                     content: contentString 
                  });
               }

               //Gives each station an infowindow that displays the information above
               marker.createInitialContentString();

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