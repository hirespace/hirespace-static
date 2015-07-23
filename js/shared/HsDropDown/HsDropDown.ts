module hirespace {
    'use strict';

    export class DropDown {
        static listen() {
            $('.drop-down').click(e => {
                let hasDropDownParent = $(e.target).parents().closest('.drop-down-menu');

                if (hasDropDownParent.length > 0) {
                    return false;
                }

                $('.drop-down-menu').removeClass('is-visible');
                $(e.currentTarget).find('.drop-down-menu').toggleClass('is-visible');
            });

            $('body').click(e => {
                let hasDropDownParent = $(e.target).parents().closest('.drop-down');

                if (hasDropDownParent.length > 0) {
                    e.preventDefault();
                    return false;
                }

                $('.drop-down-menu').removeClass('is-visible');
            });
        }
    }
}