module hirespace {
    'use strict';

    export interface IApiUrls {
        production: string;
        development: string;
        test: string;
    }

    export interface IApiRoutes {
        bookings: string;
    }

    let apiUrls: IApiUrls = {
        production: 'https://api.hirespace.com/',
        development: 'http://stagingmongoapi.hirespace.com/',
        test: 'http://api.hirespace.dev/'
    };

    let apiRoutes: IApiRoutes = {
        bookings: 'enquiries/'
    };

    let productionHost: string = 'hirespace.com';
    let testHost: string = 'localhost:6066';

    export class Config {
        static getApiUrl(): string {
            return apiUrls[hirespace.Debug.getEnvironment()];
        }

        static getProductionHost(): string {
            return productionHost;
        }

        static getTestHost(): string {
            return testHost;
        }

        static getApiRoutes(): IApiRoutes {
            return apiRoutes;
        }
    }
}