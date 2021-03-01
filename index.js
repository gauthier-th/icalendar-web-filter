require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const ical = require('node-ical');
const serialize = require('./serialize');

const app = express();

app.use(helmet());
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.set('view options', {
	layout: false
});

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/filter', async (req, res) => {
	if (!req.query.calendar_url)
		return res.status(400).json({ error: 'Invalid body' });
	try {
		const calendar = await ical.async.fromURL(req.query.calendar_url);
		const result = {};
		const regexp_summary = req.query.regexp_summary ? new RegExp(req.query.regexp_summary, req.query.summary_case_insensitive === "0" ? "i" : "i") : null;
		const regexp_location = req.query.regexp_location ? new RegExp(req.query.regexp_location, req.query.location_case_insensitive === "0" ? "i" : "i") : null;
		const regexp_description = req.query.regexp_description ? new RegExp(req.query.regexp_description, req.query.description_case_insensitive === "0" ? "i" : "i") : null;
		for (let uid of Object.keys(calendar)) {
			if ((!regexp_summary || !regexp_summary.test(calendar[uid].summary)) && (!regexp_location || !regexp_location.test(calendar[uid].location)) && (!regexp_description || !regexp_description.test(calendar[uid].description)))
				result[uid] = calendar[uid];
		}
		res.set('content-disposition', 'inline; filename=ADECal.ics');
		res.set('content-type', 'text/calendar;charset=UTF-8');
		res.end(serialize(result));
	}
	catch (e) {
		console.error(e);
		res.end('Unexpected error');
	}
});


app.listen(process.env.PORT, () => {
	console.log('Server listening on port ' + process.env.PORT + '.')
});