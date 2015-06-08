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

    return res.render('enquiries-feed/layout', {
        partials: {
            progressBar: 'enquiries-feed/partials/progress-bar',
            modalCallCustomer: 'enquiries-feed/partials/modal-call-customer',
            modalEmailCustomer: 'enquiries-feed/partials/modal-email-customer',
            modalQuickReply: 'enquiries-feed/partials/modal-quick-reply'
        }
    });
}