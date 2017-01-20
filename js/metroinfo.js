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

// function getRealTimePrediction(stationCode){
// 	return 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + stationCode + '?api_key=1371dab10bc845bea40ef0d8f9aae1cf'
// }

// var trainStationRequest = new XMLHttpRequest();
// trainStationRequest.addEventListener('load', saveMetroData);
// trainStationRequest.addEventListener('error', transferFailed);
// trainStationRequest.addEventListener('abort', transferCanceled);
// trainStationRequest.open('GET', getRealTimePrediction('A04'), true);
// trainStationRequest.send();