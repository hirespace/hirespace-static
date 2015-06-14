module hirespace {
    'use strict';

    export interface IAssertionSentenceN {
        object: string;
        type: string;
        value: string | boolean;
    }

    export interface ISplitRule {
        classes: Array<string>;
        assertions: Array<Array<string>>;
    }

    export class ToggleClass {
        rules: Array<ISplitRule>;

        constructor(private attr: string, public target: any) {
            this.rules = _.map(attr.split(','), (rule) => this.splitRule(rule));
        }

        splitRule(rule: string): ISplitRule {
            let sides = _.map(rule.split(':'), (side) => _.trim(side));

            if (sides.length !== 2) {
                throw 'Invalid input';
            }

            return {
                classes: _.map(_.first(sides).split('+'), (cls) => _.trim(cls)),
                assertions: this.parseAndAssertions(_.last(sides))
            };
        }

        private parseAndAssertions(assertions: string) {
            // @TODO
            // abstract double amp symbol to config
            return _.map(assertions.split('&&'), (assertionGroup) => this.parseOrAssertions(assertionGroup));
        }

        private parseOrAssertions(assertionGroup: string) {
            // @TODO
            // abstract double pipe symbol to config
            return _.map(assertionGroup.split('||'), (assertion) => _.trim(assertion));
        }

        evaluateAll(assertionGroups): Array<Array<boolean>> {
            return _.map(assertionGroups, (group: Array<string>) =>
                _.map(group, (assertion) => hirespace.AssertionParser.evaluateAssertion(assertion, this.target)));
        }
    }
}