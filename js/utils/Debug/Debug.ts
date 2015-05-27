module hirespace {
    'use strict';

    export class Debug {
        static getControllerIdentifier(): string {
            let pathname = window.location.pathname;

            return pathname.split('/')[1];
        }

        static getHost(): string {
            return window.location.host;
        }

        static getHostName(): string {
            return window.location.hostname;
        }

        static getEnvironment(givenHost?: string): string {
            let host = givenHost ? givenHost : hirespace.Debug.getHost();

            switch (host) {
                case Config.getProductionHost():
                    return 'production';
                case Config.getTestHost():
                    return 'test';
                default:
                    return 'development';
            }
        }
    }
}