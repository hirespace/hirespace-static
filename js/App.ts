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

        static register() {
            _.forEach(hirespace.App.subscriptions, (subscription: any, name: string) => {
                hirespace.Logger.debug(name + ' successfully registered');

                if (hirespace.App.knockout[name]) {
                    ko.applyBindings(subscription);
                }

                return subscription;
            });
        }
    }

    $(window).load(() => {
        hirespace.Logger.debug(new Date() + ' || hirespace website now running');

        hirespace.App.register();
    });
}