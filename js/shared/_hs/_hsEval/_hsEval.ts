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
        crawlElementsSelectors: Array<string>;

        constructor(public resolveObject: any, public scope: string) {
            // @TODO
            // think about abstracting into a Config object
            this.attributes = {
                dynamic: ['hs-bind', 'hs-repeat', 'hs-class', 'hs-show', 'hs-hide', 'hs-click'],
                static: ['hs-toggle', 'hs-modal', 'hs-tabs', 'hs-ctr']
            };

            //_.map(this.attributes.dynamic)
        }

        static setSelector(scope, attr) {
            return _.map(scope.split(','), selector => selector + ' ' + attr).join(',');
        }
    }
}