/**
 * @param {Record<string, ical.CalendarComponent>} parsed 
 * @returns {string}
 */
function serialize(parsed) {
	let result = [];
	result.push('BEGIN:VCALENDAR');

	result.push('METHOD:REQUEST');
	result.push('PRODID:-//ADE/version 6.0');
	result.push('VERSION:2.0');
	result.push('CALSCALE:GREGORIAN');

	for (let uid of Object.keys(parsed)) {
		const event = parsed[uid]
		result.push('BEGIN:VEVENT');
		result.push('DTSTAMP:' + event.end.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		result.push('DTSTART:' + event.end.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		result.push('DTEND:' + event.end.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		result.push('SUMMARY:' + event.summary.replace(/\n/g, '\\n').replace(', ', '\\,'));
		result.push('LOCATION:' + event.location.replace(/\n/g, '\\n').replace(', ', '\\,'));
		result.push('DESCRIPTION:' + event.description.replace(/\n/g, '\\n').replace(', ', '\\,'));
		result.push('UID:' + uid.replace(', ', '\\,'));
		result.push('CREATED:' + event.end.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		result.push('LAST-MODIFIED:' + event.end.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		result.push('SEQUENCE:' + event.sequence);
		result.push('END:VEVENT');
	}

	result.push('END:VCALENDAR');

	result = result.map(v => {
		if (v.length > 73)
			return [v.slice(0, 73), ' ' + v.slice(73)];
		else
			return v;
	})
	return result.flat().join('\n') + '\n';
}

module.exports = serialize;