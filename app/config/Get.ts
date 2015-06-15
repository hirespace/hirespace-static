import express = require('express')

export function index(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'HomeController',
        pageTitle: 'Documentation',
        bodyClass: 'page-documentation'
    };

    return res.render('home/layout');
}

export function enquiries(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'EnquiriesController',
        pageTitle: 'Enquiries',
        bodyClass: 'page-enquiries'
    };

    return res.render('enquiries/layout', {
        partials: {
            detailsBar: 'enquiries/partials/details-bar',
            enquiriesFeed: 'enquiries/partials/enquiries-feed',
            modalCallCustomer: 'enquiries/partials/modal-call-customer',
            modalEmailCustomer: 'enquiries/partials/modal-email-customer',
            modalQuickReply: 'enquiries/partials/modal-quick-reply',
            progressBar: 'enquiries/partials/progress-bar',
            navLoggedIn: 'partials/nav-logged-in'
        }
    });
}