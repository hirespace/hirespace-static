/// <reference path='_ref.ts' />

module hirespace {
    'use strict';

    export interface IRoutes {
        home: string
    }

    export class App {
        static routes: IRoutes = {
            home: 'HomeController',
            'enquiries-feed.html': 'EnquiriesFeedController'
        };

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
            let controllerIdentifier = hirespace.Debug.getControllerIdentifier(),
                controller = hirespace.App.routes[controllerIdentifier];

            if (controller) {
                if (hirespace.App.knockout[controller]) {
                    ko.applyBindings(new hirespace.App.subscriptions[controller]);
                } else {
                    new hirespace.App.subscriptions[controller];
                }
            }
        }
    }

    $(window).load(() => {
        hirespace.Logger.debug(new Date() + ' || Hire Space app now running');

        hirespace.App.register();
    });
}