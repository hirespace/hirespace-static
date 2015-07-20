/// <reference path='_ref.ts' />

module hirespace {
    'use strict';

    export class App {
        static subscriptions: {
            [name: string]: any
        } = {};

        static knockout: {
            [name: string]: boolean
        } = {};

        static subscribe(name: string, func: any, knockout?: boolean) {
            hirespace.App.subscriptions[name] = func;

            if (knockout) {
                hirespace.App.knockout[name] = true;
            }
        }
    }

    $(document).ready(() => {
        $('body').removeClass('pre-load');

        hirespace.Logger.debug('Hire Space app now running');

        let controller = $('body').attr('data-ctr');

        hirespace.DropDown.listen();

        if (controller && hirespace.App.subscriptions[controller]) {
            if (hirespace.App.knockout[controller]) {
                ko.applyBindings(new hirespace.App.subscriptions[controller]);
            } else {
                new hirespace.App.subscriptions[controller];
            }
        }
    });
}