module hirespace {
    'use strict';

    export interface IAssertionSentenceN {
        object: string;
        type: string;
        value: string | boolean;
    }

    interface ISplitRule {
        classes: Array<string>;
        assertions: Array<Array<string>>;
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

        isMultiple(assertionGroups) {
            //assertionGroups.length == 1 ? {and: assertionGroups} : NOAND;
            //return assertionGroups.length !== 1;
            return _.map(assertionGroups, (andGroup) => this.evaluate(andGroup));
        }

        evaluate(andGroup) {
            console.log(andGroup);
            let evaluated = _.map(andGroup, (assertion: string) => {
                //console.log(assertion);
                let assertionData = hirespace.ToggleClass.parseAssertion(assertion);
                //hirespace.ToggleClass.resolveObject()
                //return true;
                console.log(assertionData);
                let resolved = hirespace.ToggleClass.resolveObject(assertionData.object, {
                    bookingData: {
                        _id: 'id',
                        stage: 'In Progress'
                    }
                }, true);
                console.log(resolved);
                let isValid: boolean;
                isValid = assertionData.type == 'equality' ? (resolved == assertionData.value) : (!_.isUndefined(resolved));
                console.log(isValid);
                return assertionData;
            });
            return andGroup.length;
        }


        static parseAssertion(assertionString: string): IAssertionSentenceN {
            let assertion = _.trim(assertionString),
                splitAssertion = assertion.split('=='),
                type: string = splitAssertion.length == 2 ? 'equality' : 'boolean';

            return {
                object: _.trim(_.first(splitAssertion)),
                type: type,
                value: type == 'equality' ? _.trim(_.last(splitAssertion), ' \' ') : true
            }
        }

        static resolveObject(path: string, target: Object, safe?: boolean) {
            let keys = path.split('.');

            return _.reduce(keys, (previous, current) => !safe ? previous[current] : (previous ? previous[current] : undefined),
                target || self);
        }
    }
}