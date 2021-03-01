function generateURL() {
	var url = document.getElementById("url").value;
	var regexpSummary = document.getElementById("regexp-summary").value;
	var regexpLocation = document.getElementById("regexp-location").value;
	var regexpDescription = document.getElementById("regexp-description").value;
	var startDate = document.getElementById("start-date").value;
	var endDate = document.getElementById("end-date").value;

	var result = "calendar_url=" + encodeURIComponent(url);
	if (regexpSummary)
		result += "&regexp_summary=" + encodeURIComponent(regexpSummary);
	if (regexpLocation)
		result += "&regexp_location=" + encodeURIComponent(regexpLocation);
	if (regexpDescription)
		result += "&regexp_description=" + encodeURIComponent(regexpDescription);
	
	if (startDate)
		result += "&start_date=" + encodeURIComponent(startDate)
	if (endDate)
		result += "&end_date=" + encodeURIComponent(endDate)

	countEvents(result);
	result = window.location.protocol + "//" + window.location.host + "/filter?" + result;
	document.getElementById("result").value = result;
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('generate').addEventListener('click', generateURL);
});

function countEvents(url) {
	fetch(window.location.protocol + "//" + window.location.host + "/filter-infos?" + url).then(function(response) { return response.json() }).then(function(infos) {
		document.getElementById("note").innerText = "Events count in the new calendar : " + infos.newCount;
		document.getElementById("note").innerText += "\nEvents count in the old calendar : " + infos.oldCount;
	});
}