module hirespace {
    'use strict';

    export class Modal {
        static listen() {
            $('.modal .hs-modal-close').click(() => {
                $('.modal, .modal-backdrop').addClass('is-hidden');
            });

            $('.hs-modal').click(e => {
                let toggleModalId = $(e.target).attr('hs-modal');

                $('.modal-backdrop').removeClass('is-hidden');
                $('#' + toggleModalId).removeClass('is-hidden');
            });
        }
    }
}