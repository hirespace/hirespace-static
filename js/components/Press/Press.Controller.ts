module hirespace {
    'use strict';

    export class PressController {
        constructor() {
            console.log('Press Page');

            new hirespace._hsEval({}, '#press');
        }
    }

    hirespace.App.subscribe('PressController', PressController);
}