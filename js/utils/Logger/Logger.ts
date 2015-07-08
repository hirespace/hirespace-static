module hirespace {
    'use strict';

    export class Logger {
        private static execute(type: string, data: any, notify?: boolean) {
            if (hirespace.Debug.getEnvironment() !== 'development') return false;

            console[type](data);

            if (notify) hirespace.Notification.generate(data, type);
        }

        static log(data: any, notify?: boolean) {
            return hirespace.Logger.execute('log', data, notify);
        }

        static info(data: any, notify?: boolean) {
            return hirespace.Logger.execute('info', data, notify);
        }

        static error(data: any, notify?: boolean) {
            return hirespace.Logger.execute('error', data, notify);
        }

        static debug(message: string, notify?: boolean) {
            return hirespace.Logger.execute('debug', new Date() + ' ' + message, notify);
        }
    }
}