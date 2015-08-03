module hirespace {
    'use strict';

    export interface IApiUrls {
        production: string;
        development: string;
        test: string;
    }

    export interface IApiRoutes {
        getEnquiry: string;
        updateEnquiry: string;
        stage: string;
        stages: string;
    }

    let apiUrls: IApiUrls = {
        production: 'https://mongoapi.hirespace.com/',
        development: 'http://stagingmongoapi.hirespace.com/',
        test: 'http://stagingmongoapi.hirespace.com/'
    };

    let enquirySendEmailApi: IApiUrls = {
        production: 'https://venues.hirespace.com/EnquiriesFeed/SendEmail',
        development: 'http://staging.venues.hirespace.com/EnquiriesFeed/SendEmail',
        test: 'http://staging.venues.hirespace.com/EnquiriesFeed/SendEmail'
    };

    let apiRoutes: IApiRoutes = {
        getEnquiry: 'methods/enquiries/getEnquiry/',
        updateEnquiry: 'methods/enquiries/updateEnquiry/',
        stage: 'methods/stages/getStageEnquiries/',
        stages: 'methods/stages/getStagesCount'
    };

    let productionHost: string = 'venues.hirespace.com';
    let testHost: string = 'localhost:6066';

    export class Config {
        static getApiUrl(): string {
            return apiUrls[hirespace.Debug.getEnvironment()];
        }

        static getEnquirySendEmailApi(): string {
            return enquirySendEmailApi[hirespace.Debug.getEnvironment()];
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