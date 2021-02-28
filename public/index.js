function generateURL() {
	document.getElementById("result").value = window.location.protocol + "://" + window.location.host + "/filter?calendar_url=" + encodeURIComponent(document.getElementById("url").value) + "&regexp=" + encodeURIComponent(document.getElementById("regexp").value);
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('generate').addEventListener('click', generateURL);
});