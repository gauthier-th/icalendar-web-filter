const ical = require('node-ical');

module.exports.filterCalendar = async (query) => {
	const calendar = await ical.async.fromURL(query.calendar_url);
	const result = {};
	const regexp_summary = query.regexp_summary ? new RegExp(query.regexp_summary, query.summary_case_insensitive === "0" ? "i" : "i") : null;
	const regexp_location = query.regexp_location ? new RegExp(query.regexp_location, query.location_case_insensitive === "0" ? "i" : "i") : null;
	const regexp_description = query.regexp_description ? new RegExp(query.regexp_description, query.description_case_insensitive === "0" ? "i" : "i") : null;
	const start_date = query.start_date && query.start_date.match(/^\d{4}-(0\d|1[12])-([012]\d|3[01])$/) ? query.start_date : null;
	const end_date = query.end_date && query.end_date.match(/^\d{4}-(0\d|1[12])-([012]\d|3[01])$/) ? query.end_date : null;
	for (let uid of Object.keys(calendar)) {
		if (regexp_summary && regexp_summary.test(calendar[uid].summary))
			continue;
		if (regexp_location && regexp_location.test(calendar[uid].location))
			continue;
		if (regexp_description && regexp_description.test(calendar[uid].description))
			continue;

		if (start_date && dateGreaterThan(start_date, dateToString(calendar[uid].start), true))
			continue;
		if (end_date && dateGreaterThan(dateToString(calendar[uid].end), end_date, true))
			continue;

		result[uid] = calendar[uid];
	}
	return {
		calendar,
		result
	};
}

/**
 * @param {Date} date 
 */
function dateToString(date) {
	return date.getFullYear() + "-" + "0".repeat(2 - ((date.getMonth() + 1) + "").length) + (date.getMonth() + 1) + "-" + "0".repeat(2 - (date.getDate() + "").length) + date.getDate();
}
/**
 * @param {string} date1 
 * @param {string} date2 
 * @param {string} strict 
 */
function dateGreaterThan(date1, date2, strict = false) {
	if (!strict && date1 === date2)
		return true;
	else if (date1 === date2)
		return false;
	return date1.localeCompare(date2) > 0;
}