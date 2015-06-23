module hirespace {
    'use strict';

    export class HsBind {
        static updateElem(elem: HTMLElement, resolveObject: any) {
            let path: string = $(elem).attr('hs-bind');

            if (!path || path.length < 1) {
                hirespace.Logger.error('Invalid hs-bind attribute');
                return false;
            }

            let value: string = hirespace.AssertionParser.resolveObject(path, resolveObject, true).toString();

            switch (elem.tagName.toLowerCase()) {
                case 'input':
                    $(elem).attr('value', value);
                    break;
                default:
                    $(elem).html(value);
                    break;
            }
        }
    }
}