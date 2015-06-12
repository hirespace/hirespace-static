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
                hirespace.View.updateElement(elem, target);
            });
        }

        static updateElement(elem: Element, target: any) {
            let sentence: string = $(elem).attr('data-toggle-view'),
                assertionMetaData: IAssertionMetaData = hirespace.View.parseAssertionMetaData(sentence),
                value = hirespace.View.resolveObject(assertionMetaData.assertion.object, target),
                expectedValue = assertionMetaData.assertion.value;

            let isValid: boolean,
                addClass: string,
                removeClass: string;

            isValid = assertionMetaData.assertion.type == 'equality' ? (value == expectedValue) : (!_.isUndefined(value));

            switch (assertionMetaData.action) {
                case 'show':
                    addClass = isValid ? 'is-visible' : 'is-hidden';
                    removeClass = isValid ? 'is-hidden' : 'is-visible';
                    break;
                case 'hide':
                    addClass = isValid ? 'is-hidden' : 'is-visible';
                    removeClass = isValid ? 'is-visible' : 'is-hidden';
                    break;
                default:
                    addClass = isValid ? assertionMetaData.action : '';
                    removeClass = isValid ? '' : assertionMetaData.action;
                    break;
            }

            $(elem).removeClass(removeClass).addClass(addClass);
        }

        static toggleAttrs(attr: string) {
            let attrs = JSON.parse(attr);

            _.forEach(attrs, (id) => $('#' + id).toggleClass('is-hidden'));
        }
    }
}