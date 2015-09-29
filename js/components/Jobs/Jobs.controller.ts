module hirespace {
    'use strict';

    export class JobsController {

        constructor() {
            console.log('Jobs Page');

        }
    }

    hirespace.App.subscribe('JobsController', JobsController);
}