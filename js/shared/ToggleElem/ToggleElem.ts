module hirespace {
    'use strict';

    export class ToggleElem {
        static listen() {
            // @TODO
            // abstract hs-toggle into a config var
            $('[hs-toggle]').click(e => {
                let toggleAttrs = $(e.target).attr('hs-toggle');

                hirespace.ToggleElem.toggle(toggleAttrs);
            });
        }

        static toggle(attr: string) {
            let ids = JSON.parse(attr);

            _.forEach(ids, id => $('#' + id).toggleClass('is-hidden'));
        }
    }
}