module hirespace {
    'use strict';

    export class HomeController {
        name: string;

        constructor() {
            this.name = 'Hello World';

            hirespace.Logger.debug(this.name);
        }
    }

    hirespace.App.subscribe('HomeController', HomeController, true);
}