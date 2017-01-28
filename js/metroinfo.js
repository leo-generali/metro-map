//Gets predictive metro rail data from WMATA API


function addIncidents(){
	var xhr = new XMLHttpRequest();
	var ulElem = document.getElementById('incidents');

	xhr.onreadystatechange = function() {
		if(this.readyState === 4 && this.status === 200){
			var railIncidents = JSON.parse(xhr.response);
			railIncidents = railIncidents.Incidents

			for(var x = 0; x < railIncidents.length; x++){
				console.log(x);
				var liElem = document.createElement('li');
				liElem.className = 'incidentInfo'

			  	liElem.appendChild(document.createTextNode(railIncidents[x].Description));
			  	ulElem.appendChild(liElem);
				
			}
		}else{
			return "error";
		}
	}
	xhr.open('GET', 'https://api.wmata.com/Incidents.svc/json/Incidents?api_key=1371dab10bc845bea40ef0d8f9aae1cf', true);
	xhr.send();
}