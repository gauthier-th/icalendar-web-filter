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
	if (!req.query.calendar_url || !req.query.regexp)
		return res.status(400).json({ error: 'Invalid body' });
	const calendar = await ical.async.fromURL(req.query.calendar_url);
	const result = {};
	const regexp = new RegExp(req.query.regexp, req.query.case_insensitive);
	for (let uid of Object.keys(calendar)) {
		if (regexp.test(calendar[uid].summary))
			result[uid] = calendar[uid];
	}
	res.end(serialize(result));
});


app.listen(process.env.PORT, () => {
	console.log('Server listening on port ' + process.env.PORT + '.')
});