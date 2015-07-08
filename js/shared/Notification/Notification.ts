module hirespace {
    'use strict';

    let clearNotificationTimeout;

    export class Notification {
        static generate(message: string, type: string) {
            $('#notification').attr('class', '').addClass('active ' + type).html('<main>' + message + '</main>');

            if (clearNotificationTimeout) clearTimeout(clearNotificationTimeout);

            // @TODO
            // abstract interval into a magic var
            clearNotificationTimeout = setTimeout(() => {
                $('#notification').removeClass('active');
            }, 5000);
        }
    }
}