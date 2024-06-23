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
		const event = parsed[uid];
		result.push('BEGIN:VEVENT');
		if (event.dtstamp) result.push('DTSTAMP:' + event.dtstamp.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		if (event.start) result.push('DTSTART:' + event.start.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		if (event.end) result.push('DTEND:' + event.end.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		if (event.summary) result.push('SUMMARY:' + event.summary.replace(/\n/g, '\\n').replace(', ', '\\,'));
		if (event.location) result.push('LOCATION:' + event.location.replace(/\n/g, '\\n').replace(', ', '\\,'));
		if (event.description) result.push('DESCRIPTION:' + event.description.replace(/\n/g, '\\n').replace(', ', '\\,'));
		if (uid) result.push('UID:' + uid.replace(', ', '\\,'));
		if (event.created) result.push('CREATED:' + event.created.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		if (event.lastmodified) result.push('LAST-MODIFIED:' + event.lastmodified.toISOString().replace(/([-:]|.000(Z)$)/g, '$2'));
		if (event.sequence) result.push('SEQUENCE:' + event.sequence);
		if (event.alarm) {
			result.push('BEGIN:VALARM');
			result.push('ACTION:DISPLAY');
			result.push('TRIGGER;RELATED=' + event.alarm);
			result.push('END:VALARM');
		}
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