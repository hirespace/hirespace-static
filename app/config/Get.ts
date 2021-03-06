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
            modalSuggestEdits: 'page-enquiries/partials/modal-suggest-edits',
            modalUserActions: 'page-enquiries/partials/modal-user-actions',
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

    return res.render('page-sandbox/layout', {
        partials: {
            footer: 'partials/footer'
        }
    });
}

export function legal(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'LegalController',
        pageTitle: 'Legal',
        bodyClass: 'page-legal'
    };

    return res.render('page-legal/layout', {
        partials: {
            footer: 'partials/footer'
        }
    });
}

export function press(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'PressController',
        pageTitle: 'Press',
        bodyClass: 'page-press'
    };

    return res.render('page-press/layout', {
        partials: {
            footer: 'partials/footer'
        }
    });
}

export function team(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'TeamController',
        pageTitle: 'Team',
        bodyClass: 'page-team'
    };

    return res.render('page-team/layout', {
        partials: {
            footer: 'partials/footer'
        }
    });
}

export function jobs(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'JobsController',
        pageTitle: 'Jobs',
        bodyClass: 'page-jobs'
    };

    return res.render('page-jobs/layout', {
        partials: {
            footer: 'partials/footer'
        }
    });
}

export function job(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'JobsController',
        pageTitle: 'Job',
        bodyClass: 'page-job'
    };

    return res.render('page-jobs/job', {
        partials: {
            footer: 'partials/footer'
        }
    });
}

export function categroy(req: express.Request, res: express.Response) {
    res.locals = {
        controller: 'CategoryController',
        pageTitle: 'Category',
        bodyClass: 'page-category'
    };

    return res.render('page-category/layout', {
        partials: {
            footer: 'partials/footer'
        }
    });
}