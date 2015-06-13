module hirespace {
    'use strict';

    export class AssertionParser {
        static parseAll(assertionGroups: Array<Array<boolean>>): Array<boolean> {
            return _.map(assertionGroups, (group: Array<boolean>) => _.indexOf(group, true) !== -1);
        }

        static parse(assertions: Array<boolean>): boolean {
            return _.indexOf(assertions, false) == -1;
        }
    }
}