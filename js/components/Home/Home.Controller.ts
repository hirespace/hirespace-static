module hirespace {
    'use strict';

    export class HomeController {
        name: string;

        constructor() {
            this.name = 'Hello World';
        }
    }

    hirespace.App.subscribe('HomeController', new HomeController, true);
}