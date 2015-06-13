module hirespace {
    'use strict';

    interface ISplitRule {
        classes: Array<string>;
        assertions: string;
    }

    export class ToggleClass {
        rules: Array<ISplitRule>;

        constructor(private attr: string) {
            this.rules = _.map(attr.split(','), (rule) => this.splitRule(rule));
        }

        splitRule(rule: string): ISplitRule {
            let sides = _.map(rule.split(':'), (side) => _.trim(side));

            if (sides.length !== 2) {
                throw 'invalid input';
            }

            return {
                classes: _.map(_.first(sides).split('+'), (cls) => _.trim(cls)),
                assertions: _.last(sides)
            };
        }
    }
}