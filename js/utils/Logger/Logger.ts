module hirespace {
    'use strict';

    export class Logger {
        static log(data: any) {
            if (hirespace.Debug.getEnvironment() !== 'development') {
                return false;
            }

            console.log(data);
        }

        static info(data: any) {
            if (hirespace.Debug.getEnvironment() !== 'development') {
                return false;
            }

            console.info(data);
        }

        static error(data: any) {
            if (hirespace.Debug.getEnvironment() !== 'development') {
                return false;
            }

            console.error(data);
        }

        static debug(message: string) {
            if (hirespace.Debug.getEnvironment() !== 'development') {
                return false;
            }

            console.debug(message);
        }
    }
}