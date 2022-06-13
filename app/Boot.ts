/// <reference path='_ref.ts' />

import bodyParser = require('body-parser')
import errorHandler = require('errorhandler')
import express = require('express')
import methodOverride = require('method-override')

import getRequest = require('./config/Get')

let hogan = require('hogan-express'),
    app = express(),
    env = process.env.NODE_ENV || 'development';

app.engine('html', hogan);
app.enable('view cache');

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('layout', 'layout');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/assets', express.static('.'));

if (env === 'development') {
    app.use(errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
} else {
    app.use(errorHandler());
}

app.get('/', getRequest.index);
app.get('/enquiries', getRequest.enquiries);
app.get('/sandbox', getRequest.sandbox);
app.get('/legal', getRequest.legal);
app.get('/press', getRequest.press);
app.get('/team', getRequest.team);
app.get('/jobs', getRequest.jobs);
app.get('/jobs/job', getRequest.job);
app.get('/category', getRequest.categroy);

app.listen(6065, function () {
    console.log('Express server listening on port %d in %s mode', 6065, app.settings.env);
});
