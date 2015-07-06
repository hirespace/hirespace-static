module hirespace {
    'use strict';

    interface hsAttributes {
        dynamic: Array<string>,
        static: Array<string>
    }


    // @TODO take a look at proper Object-oriented model initiation

    //class FeedData implements IEnquiriesFeedData {
    //    count;
    //    current;
    //    remaining;
    //
    //    constructor() {
    //        this.count = {};
    //        this.current = new TemplateData();
    //        this.remaining = 0;
    //    }
    //}
    //
    //class TemplateData implements ITemplateData {
    //    _id = '';
    //    budget = 0;
    //    customerName: '';
    //    eventdate: '';
    //    stage: '';
    //    venueName: '';
    //    word: '';
    //}

    //class hsObjects

    // This class should be responsible for updating components based on the scope and data object provided
    // Every attribute should have importance rating -> that is the order in which data will be bound to elements
    //

    export class _hsEval {
        attributes: hsAttributes;
        crawlElementsSelectors: Array<{[attr: string]: string}>;

        lolz: string;
        lolz2: {};

        constructor(public resolveObject: any, public scope: string) {
            this.lolz = 'Mega LOOOOOOLz';
            this.lolz2 = {
                name: 'Name',
                surname: 'Surname'
            };

            // @TODO
            // think about abstracting into a Config object
            this.attributes = {
                // @TODO
                // beware the order!
                dynamic: ['hs-bind', 'hs-class', 'hs-repeat', 'hs-show', 'hs-hide', 'hs-click'],
                static: ['hs-toggle', 'hs-modal', 'hs-tabs', 'hs-ctr']
            };

            //let selectors = _.map(this.attributes.dynamic, attr => {
            //    return hirespace._hsEval.setSelector(this.scope, attr);
            //});
            //
            //console.log(selectors);

            let allSelectAttr = _.flatten([this.attributes.dynamic, this.attributes.static]);

            _.forEach(allSelectAttr, (attr: string) => {
                hirespace._hsEval.setClass($(scope + ' [' + attr + ']'), attr);
            });

            this.crawlElementsSelectors = _.map(this.attributes.dynamic, (attr: string) => {
                let obj: {[attr: string]: string} = {};
                obj[attr] = hirespace._hsEval.setSelector(this.scope, attr);
                return obj;
            });
            //console.log(this.crawlElementsSelectors);

            this.resolveBindings();
        }

        static setSelector(scope: string, attr: string): string {
            return _.map(scope.split(','), selector => selector + ' .' + attr).join(',');
        }

        static setClass(elem: JQuery, attr: string) {
            $(elem).addClass(attr + ' hs-isolate-scope');
        }

        resolveBindings() {
            let resolveObject = this;

            // @TODO beware this is Object, Key now
            _.forEach(this.crawlElementsSelectors, (attr: string, selector: string) => {
                let elems = $(selector);

                switch (attr) {
                    case 'hs-class':
                        _.forEach(elems, elem => {
                            let attribute = $(elem).attr(attr),
                                rules = new hirespace.ToggleClass(attribute, resolveObject);

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
                        });
                }
            });
        }
    }
}