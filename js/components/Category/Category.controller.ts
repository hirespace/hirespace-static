module hirespace {
    'use strict';

    export class CategoryController {
        constructor() {
            console.log('Category Page');

        }
    }

    hirespace.App.subscribe('CategoryController', CategoryController);
}