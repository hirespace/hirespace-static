module hirespace {
    'use strict';

    export class View {
        static updateView(target, scope?: string) {
            // @TODO
            // abstract hs-class into a config var
            let hsClass = $((scope ? scope + ' ' : '') + '[hs-class]'),
                hsBind = $((scope ? scope + ' ' : '') + '[hs-bind]');

            // @TODO
            // abstract into an object to loop through
            _.forEach(hsClass, elem => hirespace.View.updateElem(elem, target));
            _.forEach(hsBind, elem => hirespace.HsBind.updateElem(elem, target));
        }

        static updateElem(elem: Element, target: any) {
            let attr = $(elem).attr('hs-class'),
                rules = new hirespace.ToggleClass(attr, target);

            _.forEach(rules.rules, (rule: IRule) => {
                let evaluations = rules.evaluateAll(rule.assertions),
                    isValid = hirespace.AssertionParser.parse(hirespace.AssertionParser.parseAll(evaluations));

                switch (isValid) {
                    case true:
                        $(elem).addClass(rule.classes.join(' '));
                        break;
                    default:
                        $(elem).removeClass(rule.classes.join(' '));
                        break;
                }
            });
        }
    }
}