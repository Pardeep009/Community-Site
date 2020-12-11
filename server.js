require('dotenv').config();

const express = require('express');

const app = express();
const session = require('express-session');
const morgan = require('morgan');

const path = require('path');

app.use(morgan('dev')); // logger for terminal
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
	saveUninitialized: true,
	secret: `${process.env.secret}`,
	resave: false,
}));

const mongoose = require('mongoose');

mongoose
	.connect(process.env.db_url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB Connected...'))
	.catch((error) => console.log('DB Connectioin error', error));

app.use('/', require('./Routes'));

app.listen(`${process.env.PORT}`, () => {
	console.log(`Running on port ${process.env.PORT}`);
});
