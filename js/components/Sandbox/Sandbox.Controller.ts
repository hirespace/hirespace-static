module hirespace {
    'use strict';

    export class SandboxController {
        constructor() {
            console.log('mega lolz!');

            new hirespace._hsEval({}, '#sandbox');
        }
    }

    hirespace.App.subscribe('SandboxController', SandboxController);
}