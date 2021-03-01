function generateURL() {
	var url = document.getElementById("url").value;
	var regexpSummary = document.getElementById("regexp-summary").value;
	var regexpLocation = document.getElementById("regexp-location").value;
	var regexpDescription = document.getElementById("regexp-description").value;

	var result = window.location.protocol + "//" + window.location.host + "/filter?calendar_url=" + encodeURIComponent(document.getElementById("url").value);
	if (regexpSummary)
		result += "&regexp_summary=" + encodeURIComponent(regexpSummary);
	if (regexpLocation)
		result += "&regexp_location=" + encodeURIComponent(regexpLocation);
	if (regexpDescription)
		result += "&regexp_description=" + encodeURIComponent(regexpDescription);

	document.getElementById("result").value = result;
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('generate').addEventListener('click', generateURL);
});