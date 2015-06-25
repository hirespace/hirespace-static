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

            switch (elem.tagName.toLowerCase()) {
                case 'input':
                    if (_.isUndefined(value) || value.length < 1) {
                        return false;
                    }

                    $(elem).attr('value', !_.isUndefined(value) ? value.toString() : '');
                    break;
                default:
                    if (_.isUndefined(value) || value.length < 1) {
                        return false;
                    }

                    $(elem).html(!_.isUndefined(value) ? value.toString() : '');
                    break;
            }
        }
    }
}