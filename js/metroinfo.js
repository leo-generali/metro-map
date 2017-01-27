//Gets predictive metro rail data from WMATA API


function getRailInfo(stationCode){
	var trainStationRequest = new XMLHttpRequest();
	var trainData = {};

	trainStationRequest.onreadystatechange = function() {
		if(trainStationRequest.readyState === 4){
			trainData = JSON.parse(trainStationRequest.response);
			trainData = trainData.Trains[0];
			return trainData;
		}else{
			return "error";
		}
	}
	trainStationRequest.open('GET', 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + stationCode + '?api_key=1371dab10bc845bea40ef0d8f9aae1cf', true);
	trainStationRequest.send('');
	
}