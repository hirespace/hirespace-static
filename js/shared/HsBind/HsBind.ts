module hirespace {
    'use strict';

    export class HsBind {
        static updateElem(elem: HTMLElement, resolveObject: any) {
            let path: string = $(elem).attr('hs-bind');

            if (!path || path.length < 1) {
                hirespace.Logger.error('Invalid hs-bind attribute');
                return false;
            }

            let value: string = hirespace.AssertionParser.resolveObject(path, resolveObject, true);

            if (!_.isUndefined(value) && !_.isNull(value) && value.toString().length > 0) {
                switch (elem.tagName.toLowerCase()) {
                    case 'input':
                        $(elem).attr('value', !_.isUndefined(value) ? value.toString() : '');
                        break;
                    default:
                        $(elem).html(!_.isUndefined(value) ? value.toString() : '');
                        break;
                }
            }
        }
    }
}