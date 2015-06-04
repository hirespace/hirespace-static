import express = require('express')

export function index(req:express.Request, res:express.Response) {
    res.locals = {
        controller: 'HomeController',
        pageTitle: 'Documentation',
        bodyClass: 'page-documentation'
    };

    return res.render('home/layout');
}

export function enquiriesFeed(req:express.Request, res:express.Response) {
    res.locals = {
        controller: 'EnquiriesFeedController',
        pageTitle: 'Enquiries Feed',
        bodyClass: 'page-enquiries-feed'
    };

    return res.render('enquiries-feed/layout');
}