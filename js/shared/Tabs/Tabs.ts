module hirespace {
    'use strict';

    export class Tabs {
        static listen() {
            $('.tabs > li span').click(e => {
                let current = $(e.target);

                if (current.parents().closest('.tabs').hasClass('disabled')) return false;

                current.parents().closest('.tabs').find('li').removeClass('active');
                current.parent().addClass('active');
            });
        }
    }
}