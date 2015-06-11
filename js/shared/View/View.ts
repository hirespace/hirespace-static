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

        static resolveObject(path: string, target: Object, safe?: boolean) {
            let keys = path.split('.');

            return _.reduce(keys, (previous, current) => !safe ? previous[current] : (previous ? previous[current] : undefined),
                target || self);
        }

        static updateView(target) {
            let assertions = $('[data-toggle-view]');

            _.forEach(assertions, (elem) => {
                let assertion = $(elem).attr('data-toggle-view'),
                    assertionMetaData = hirespace.View.parseAssertionMetaData(assertion);

                let leftSide = hirespace.View.resolveObject(assertionMetaData.assertion.object, target);
                let rightSide = assertionMetaData.assertion.value;

                if (leftSide == rightSide) {
                    switch (assertionMetaData.action) {
                        case 'show':
                            $(elem).removeClass('is-hidden').addClass('show');
                            break;
                        default:
                            $(elem).removeClass('show').addClass('is-hidden');
                            break;
                    }
                } else {
                    switch (assertionMetaData.action) {
                        case 'show':
                            $(elem).removeClass('show').addClass('is-hidden');
                            break;
                        default:
                            $(elem).removeClass('is-hidden').addClass('show');
                            break;
                    }
                }
            });
        }
    }
}