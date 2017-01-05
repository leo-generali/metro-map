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

var map;

var testObj = {lat: 38.8951100, lng: -77.0363700};

function initMap() {
   	map = new google.maps.Map(document.getElementById('map'), {
   		center: {lat: 38.8951100, lng: -77.0363700},
   		zoom: 12
   	});

   	function populateMap(num){
   		for(var i = 0; i < num; i++){
   			testObj.lat = model.Stations[i].Lat;
   			testObj.lng = model.Stations[i].Lon;
			var marker = new google.maps.Marker({
				position: testObj,
				map: map,
			    title: model.Stations[i].Name
		  	});
   		}
   	}

   	populateMap(model.Stations.length);

}

initMap();	