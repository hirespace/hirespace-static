module hirespace {
    'use strict';

    export class View {
        static updateView(target) {
            // @TODO
            // abstract hs-class into a config var
            let elems = $('[hs-class]');

            _.forEach(elems, elem => hirespace.View.updateElem(elem, target));
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