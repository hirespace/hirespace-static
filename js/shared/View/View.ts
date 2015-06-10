module hirespace {
    'use strict';

    export interface IAssertionSentence {
        object: string;
        sentence: string;
        type: string;
        value: string | boolean;
    }

    export interface IAssertionMetaData {
        action: string;
        assertion: IAssertionSentence
    }

    export class View {
        static parseAssertionMetaData(assertion: string): IAssertionMetaData {
            let assertionSplit = assertion.split(':');

            return {
                action: _.trim(_.first(assertionSplit)),
                assertion: hirespace.View.parseAssertionSentence(_.last(assertionSplit))
            };
        }

        static parseAssertionSentence(assertionString: string): IAssertionSentence {
            let assertion = _.trim(assertionString),
                splitAssertion = assertion.split('=='),
                type: string = splitAssertion.length == 2 ? 'equality' : 'boolean';

            return {
                object: _.trim(_.first(splitAssertion)),
                sentence: assertion,
                type: type,
                value: type == 'equality' ? _.trim(_.last(splitAssertion), ' \' ') : true
            }
        }

        static getValue(target: string, source: Object) {
            let split = target.split('.');
            let val = {};
            _.reduce(split, (finalObject, nextValue) => {
                if (source[finalObject][nextValue]) {
                    console.log('valid value found');
                    val = source[finalObject][nextValue];
                }

                return finalObject + nextValue;
            });

            return val;
        }
    }
}