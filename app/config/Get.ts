import express = require('express')

export function index(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'HomeController',
        pageTitle: 'Documentation',
        bodyClass: 'page-documentation'
    };

    return res.render('page-home/layout');
}

export function enquiries(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'EnquiriesController',
        pageTitle: 'Enquiries',
        bodyClass: 'page-enquiries'
    };

    return res.render('page-enquiries/layout', {
        partials: {
            detailsBar: 'page-enquiries/partials/details-bar',
            enquiriesFeed: 'page-enquiries/partials/enquiries-feed',
            modalCallCustomer: 'page-enquiries/partials/modal-call-customer',
            modalEmailCustomer: 'page-enquiries/partials/modal-email-customer',
            modalQuickReply: 'page-enquiries/partials/modal-quick-reply',
            progressBar: 'page-enquiries/partials/progress-bar',
            navLoggedIn: 'partials/nav-logged-in'
        }
    });
}

export function sandbox(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'SandboxController',
        pageTitle: 'Sandbox',
        bodyClass: 'page-sandbox'
    };

    return res.render('page-sandbox/layout');
}