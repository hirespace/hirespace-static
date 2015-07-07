module hirespace {
    'use strict';

    export class Notification {
        static generate(message: string, type: string) {
            $('#notification').attr('class', '').addClass('active ' + type).html('<main>' + message + '</main>');

            // @TODO
            // abstract interval into a magic var
            setInterval(() => {
                $('#notification').removeClass('active');
            }, 5000);
        }
    }
}