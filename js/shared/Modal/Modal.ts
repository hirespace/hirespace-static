module hirespace {
    export class Modal {
        static listen() {
            $('.modal .undo, .modal .close').click(() => {
                $('.modal, .modal-backdrop').addClass('is-hidden');
            });

            $('.toggle-modal').click((e) => {
                let toggleModalId = $(e.target).attr('data-toggle-modal');

                $('.modal-backdrop').removeClass('is-hidden');
                $('#' + toggleModalId).removeClass('is-hidden');
            });
        }
    }
}