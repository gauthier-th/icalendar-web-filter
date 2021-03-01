require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const serialize = require('./serialize');
const actions = require('./actions');

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
		const result = await actions.filterCalendar(req.query);
		res.set('content-disposition', 'inline; filename=ADECal.ics');
		res.set('content-type', 'text/calendar;charset=UTF-8');
		res.end(serialize(result.result));
	}
	catch (e) {
		console.error(e);
		res.status(500).end('Unexpected error');
	}
});

app.get('/filter-infos', async (req, res) => {
	if (!req.query.calendar_url)
		return res.status(400).json({ error: 'Invalid body' });
	try {
		const result = await actions.filterCalendar(req.query);
		res.json({
			error: null,
			oldCount: Object.keys(result.calendar).length,
			newCount: Object.keys(result.result).length
		});
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Unexpected error' });
	}
});


app.listen(process.env.PORT, () => {
	console.log('Server listening on port ' + process.env.PORT + '.')
});