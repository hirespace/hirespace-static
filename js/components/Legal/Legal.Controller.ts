module hirespace {
    'use strict';

    export class LegalController {
        constructor() {
            console.log('Legal Page');

            new hirespace._hsEval({}, '#legal');
        }
    }

    hirespace.App.subscribe('LegalController', LegalController);
}