//Set up the Map
var markers = [];

//Handles all of the predictive rail info.

mapError = function(){
	alert('There was a problem accessing the Google Maps API. Please refresh your browser to try again.');
};

var railInfo = {
	//Holds the called rail info
	tempContent: {},

	predictedStringArr: [],

	//Initial call to the API
	getPredictedRailData: function(station, callback){
		var url = 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + station + '?api_key=1371dab10bc845bea40ef0d8f9aae1cf';
		fetch(url).then(function(response){
			return response.json();
		}).then(function(json){
			railInfo.tempContent = json;
			railInfo.createNewContentString();
			callback();
		}).catch(function(error) {
        	alert('There was a problem accessing the WMATA API. Please refresh your browser to try again.');
    	});
	},

	//Creates an array of strings using the predicted rail info
	createNewContentString: function(){
		var railLength = railInfo.tempContent.Trains.length;

		for(var i = 0; i < railLength; i++){
			var curCar = railInfo.tempContent.Trains[i];
			railInfo.predictedStringArr.push('<p class="markerdest">' + curCar.DestinationName + '</p><p class="markertime">' + curCar.Min + '</p>' + '</p><p class="stationline ' + curCar.Line + '">' + curCar.Line + '</p>');
		}
	},

	//Creates an infowindow using the string array 
	createNewInfoWindow: function(currentMarker){
		var updatedContentString = 
		'<p class="stationName">' + currentMarker.title + '</p>' + '<p class="stationAddress">' + currentMarker.address + '</p>' + '<h4 class="metroStationsServed">Estimated Metro Arrivals</h4>' +
		'<div id="content">' + '<p class="markerdest">Destination</p><p class="markertime">Arrival</p><p class="markerline">Line</p>';

		//Appends status of each train to the newly created content string
		for(var i = 0; i < railInfo.predictedStringArr.length; i++){
			updatedContentString = updatedContentString + railInfo.predictedStringArr[i];
		}

		//Appends credit to string
		updatedContentString = updatedContentString + '</div>' + '<p class="apiinfo">Data provided by WMATA API</p>';

		currentMarker.infowindow = new google.maps.InfoWindow({
			content: updatedContentString
		});

		//Resets the predictedStringArr
		railInfo.predictedStringArr = [];
	},


};

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

	//Overlays the metro rail lines
	map.data.loadGeoJson('http://opendata.dc.gov/datasets/ead6291a71874bf8ba332d135036fbda_58.geojson');


	//Colors each netrorail per it's color
	map.data.setStyle(function(feature) {
		var lineColor = feature.getProperty('NAME');
		if (lineColor === 'orange - rush +' || lineColor === 'yellow - rush +') {
			return {
				strokeWeight: 0
			};
		} else {
			return {
				strokeColor: lineColor,
				strokeOpacity: 0.8
			};
		}
	});

	//Creates text with information on the Stations name and lines that go through it
	createInitialContentString = function(tempMarker) {
		var contentString =
			'<p class="stationname">' + tempMarker.title + '</p>' + '<p class="stationaddress">' + tempMarker.address + '</p>' +
			'<h4 class="metrostationsserved">Estimated Metro Arrivals</h4>' + 
			'<div id="content">' +
			'<p class="markerdest">Destination</p><p class="markertime">Time</p><p class="markerline">Line</p>' +
			'</div>';

		tempMarker.infowindow = new google.maps.InfoWindow({
			content: contentString
		});
	};

	//Populates the metro map with every station
	function populateMap(num) {


		for (var i = 0; i < num; i++) {
			(function(current) {

				//Places marker on map
				var latLng = new google.maps.LatLng(model.Stations[current].Lat, model.Stations[current].Lon);
				var marker = new google.maps.Marker({
					position: latLng,
					map: map,
					lines: [model.Stations[current].LineCode1, model.Stations[current].LineCode2, model.Stations[current].LineCode3, model.Stations[current].LineCode4],
					title: model.Stations[current].Name,
					stationCode: model.Stations[current].Code,
					address: model.Stations[current].Address.Street + ', ' + model.Stations[current].Address.City + ' ' + model.Stations[current].Address.State,
				});

				//If that marker's infoWindow is NOT open, it will open.
				//If the marker's infoWindow IS open, it will close
				marker.infoWindowClick = function() {
					this.openInfoWindow = true;
					this.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function() {
						marker.setAnimation(null);
					}, 700);
					railInfo.getPredictedRailData(this.stationCode, function(){
						var updatedContentString = 
						'<p class="stationname">' + marker.title + '</p>' + '<p class="stationaddress">' + marker.address + '</p>' + '<h4 class="metrostationsserved">Estimated Metro Arrivals</h4>' +
						'<div id="content">' + '<p class="markerdest">Destination</p><p class="markertime">Arrival</p><p class="markerline">Line</p>';

						for(var i = 0; i < railInfo.predictedStringArr.length; i++){
							updatedContentString = updatedContentString + railInfo.predictedStringArr[i];
						}

						updatedContentString = updatedContentString + '</div>' + '<p class="apiinfo">Data provided by WMATA API</p>';

						marker.infowindow = new google.maps.InfoWindow({
							content: updatedContentString
						});

						marker.infowindow.open(marker.map, marker);

						railInfo.predictedStringArr = [];
					});
				};

				//Gives each station an infowindow that displays the information above
				createInitialContentString(marker);

				marker.addListener('click', marker.infoWindowClick);

				markers.push(marker);

			})(i);
		}
	}

	populateMap(model.Stations.length);

	//Applies KO bindings after markers is populated
	ko.applyBindings(new mapviewModel());
}


function mapviewModel() {

	var self = this;

	self.filteredMapMarkers = ko.observableArray([]);
	self.userInput = ko.observable('');
	self.mapMarkers = ko.observableArray(markers);

	//Click view infoWindow open
	self.listClick = function() {
		this.infoWindowClick();
	};

	//Since no stations have no characters in them, when the user input is blank, all stations are added to filterMapMarker
	//Once a character is typed, this function looks at all stations and finds out that character is located in it.
	//If that character is inside the function, it is added to filterMapMarker
	self.filterLocations = ko.computed(function() {
		var filter = self.userInput().toLowerCase();

		self.filteredMapMarkers.removeAll();

		self.mapMarkers().forEach(function(metroStation) {
			metroStation.setVisible(false);
			if (metroStation.title.toLowerCase().indexOf(filter) !== -1) {
				metroStation.setVisible(true);
				self.filteredMapMarkers.push(metroStation);
			}
		});
	});


	self.incidents = ko.observableArray([]);

	//Adds any incidents from WMATA API to the map overlay
	//Incidents typically involve track work that will cause delays
	self.addIncidents = ko.computed(function() {
		var url = 'https://api.wmata.com/Incidents.svc/json/Incidents?api_key=1371dab10bc845bea40ef0d8f9aae1cf'; 
		fetch(url)
		.then(function(response){
			return response.json();
		}).then(function(json){
			var railIncidents = json.Incidents;
			var ulElem = document.getElementById('incidents');
			//If there are no incidents
			if(railIncidents.length === 0 ){
				document.getElementById('incidentheader').style.display = 'none';
				ulElem.style.display = 'none';
			}else{
				railIncidents.forEach(function(incident){
					self.incidents.push(incident);
				});
			}
		}).catch(function(error) {
        	alert('There was a problem accessing the WMATA API. Please refresh your browser to try again.');
    	});
	});

	self.addIncidents();
}