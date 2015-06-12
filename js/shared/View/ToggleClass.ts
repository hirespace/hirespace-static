module hirespace {
    'use strict';

    export class ToggleClass {
        rules: Array<string>;

        constructor(private attr: string) {
            this.rules = _.map(attr.split(','), (rule) => _.trim(rule));
        }
    }
}