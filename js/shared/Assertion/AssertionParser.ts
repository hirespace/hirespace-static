module hirespace {
    'use strict';

    export interface IAssertionSentenceData {
        path: string;
        type: string;
        value: string | boolean;
    }

    export class AssertionParser {
        static parseAll(assertionGroups: Array<Array<boolean>>): Array<boolean> {
            return _.map(assertionGroups, (group: Array<boolean>) => _.indexOf(group, true) !== -1);
        }

        static parse(assertions: Array<boolean>): boolean {
            return _.indexOf(assertions, false) == -1;
        }

        static parseSentence(assertionSentence: string): IAssertionSentenceData {
            let assertionParts = _.map(assertionSentence.split('=='), (part) => _.trim(part));

            return {
                path: _.trim(_.first(assertionParts)),
                type: assertionParts.length == 2 ? 'equality' : 'boolean',
                value: assertionParts.length == 2 ? _.trim(_.last(assertionParts), ' \' ') : true
            }
        }

        static evaluateAssertion(assertionSentence: string, target: any): boolean {
            let assertionData = hirespace.AssertionParser.parseSentence(assertionSentence),
                resolved = hirespace.AssertionParser.resolveObject(assertionData.path, target, true);

            return assertionData.type == 'equality' ? (resolved == assertionData.value) : (!_.isUndefined(resolved));
        }

        private static resolveObject(path: string, target: Object, safe?: boolean): string {
            let keys = path.split('.');

            return _.reduce(keys, (previous, current) => !safe ? previous[current] : (previous ? previous[current] : undefined),
                target || self);
        }
    }
}