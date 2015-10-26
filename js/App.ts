/// <reference path='typings/tsd.d.ts' />

module hirespace {
    'use strict';

    export class App {
        static subscriptions: {
            [name: string]: any
        } = {};

        static subscribe(name: string, func: any) {
            hirespace.App.subscriptions[name] = func;
        }
    }

    $(document).ready(() => {
        $.support.cors = true;

        let body = $('body');

        hirespace.Logger.debug('Hire Space app now running');

        body.removeClass('pre-load');
        let controller = body.attr('data-ctr');

        hirespace.DropDown.listen();

        let attributes = {
            // @TODO
            // beware the order!
            dynamic: ['hs-bind', 'hs-href', 'hs-class', 'hs-repeat', 'hs-repeat-index', 'hs-show', 'hs-hide', 'hs-click'],
            static: ['hs-toggle', 'hs-modal', 'hs-modal-close', 'hs-tabs', 'hs-ctr']
        };

        _.forEach(attributes.static, (attr: string) => {
            hirespace._hsEval.setClass($('body [' + attr + ']'), attr);
        });

        if (controller && hirespace.App.subscriptions[controller]) {
            new hirespace.App.subscriptions[controller];
        }
    });
}