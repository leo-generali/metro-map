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