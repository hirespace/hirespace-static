module hirespace {
    'use strict';

    export class ToggleElem {
        static toggle(attr: string) {
            let ids = JSON.parse(attr);

            _.forEach(ids, id => $('#' + id).toggleClass('is-hidden'));
        }
    }
}