const ical = require('node-ical');

module.exports.filterCalendar = async (query) => {
	const calendar = await ical.async.fromURL(query.calendar_url);
	const result = {};
	const regexp_summary = query.regexp_summary ? new RegExp(query.regexp_summary, query.summary_case_insensitive === "0" ? "i" : "i") : null;
	const regexp_location = query.regexp_location ? new RegExp(query.regexp_location, query.location_case_insensitive === "0" ? "i" : "i") : null;
	const regexp_description = query.regexp_description ? new RegExp(query.regexp_description, query.description_case_insensitive === "0" ? "i" : "i") : null;
	for (let uid of Object.keys(calendar)) {
		if ((!regexp_summary || !regexp_summary.test(calendar[uid].summary)) && (!regexp_location || !regexp_location.test(calendar[uid].location)) && (!regexp_description || !regexp_description.test(calendar[uid].description)))
			result[uid] = calendar[uid];
	}
	return {
		calendar,
		result
	};
}