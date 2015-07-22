module hirespace {
    'use strict';

    export class Modal {
        static listen() {
            $('.modal [hs-modal-close]').on('click', () => {
                $('.modal, .modal-backdrop').addClass('is-hidden');
            });
            
            $('[hs-modal]').on('click', e => {
                let toggleModalId = $(e.target).attr('hs-modal');

                $('.modal-backdrop').removeClass('is-hidden');
                $('#' + toggleModalId).removeClass('is-hidden');
            });
        }
    }
}