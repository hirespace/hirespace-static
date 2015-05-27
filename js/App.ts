/// <reference path='_ref.ts' />

module hirespace {
    'use strict';

    export class App {
        static subscriptions: {
            [name: string]: any
        } = {};

        static subscribe(name: string, func: any) {
            hirespace.App.subscriptions[name] = func;
        }

        static register() {
            _.forEach(hirespace.App.subscriptions, (subscription: any, name: string) => {
                hirespace.Logger.debug(name + ' successfully registered');
                return subscription;
            });
        }
    }

    $(window).load(() => {
        hirespace.Logger.debug(new Date() + ' || hirespace website now running');

        hirespace.App.register();
    });
}