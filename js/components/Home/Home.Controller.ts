module hirespace {
    'use strict';

    export class HomeController {
        name: string;

        constructor() {
            hirespace.Tabs.listen();
        }
    }

    hirespace.App.subscribe('HomeController', HomeController);
}