import express = require('express')

export function index(req:express.Request, res:express.Response) {
    res.locals = {
        pageTitle: 'Documentation',
        bodyClass: 'page-documentation'
    };

    return res.render('home/layout');
}