module hirespace {
    'use strict';

    declare var initEnquiriesFeedData: IEnquiriesFeedData;

    enum Stage {'New' = 1, 'In Progress', 'Needs Archiving', 'Archived'}
    enum Status {'Confirmed' = 1, 'Closed'}

    export interface IEnquiriesFeedData {
        _id: string;
        budget: number;
        customer: {
            company: string;
            email: string;
            mobile: string;
            name: string;
            phone: string;
        };
        date: {
            finishdate?: string;
            flexible: boolean;
            startdate: string;
        };
        message: string;
        people: number;
        status: string;
        time: {
            finishtime?: string;
            flexible: boolean;
            starttime: string;
        }
        venue: {
            manager: string;
            name: string;
            team: string;
        };
        word: string;
    }

    export class EnquiriesFeedController {
        private pollingFrequency: number = 60000;

        enquiriesFeedData: KnockoutMapping;
        enquiriesFeedDataPromise: () => JQueryPromise<any>;

        constructor() {
            hirespace.Modal.listen();

            let cacheLastRes: IEnquiriesFeedData;

            // Referenced by a global variable
            this.enquiriesFeedData = ko.mapping.fromJS(initEnquiriesFeedData);

            this.enquiriesFeedDataPromise = () => {
                //return $.get('https://hirespacesprintvenues.azurewebsites.net/Enquiries/Enquiry/lolz');
                return $.get('/assets/data/enquiriesFeedData.json');
            };

            this.enquiriesFeedDataPromise().then((response: IEnquiriesFeedData) => {
                this.enquiriesFeedData = ko.mapping.fromJS(response, this.enquiriesFeedData);
                cacheLastRes = response;
            });

            setInterval(() => {
                this.enquiriesFeedDataPromise().then((response: IEnquiriesFeedData) => {
                    if (_.isEqual(response, cacheLastRes)) {
                        hirespace.Logger.debug('View update skipped');

                        return false;
                    }

                    ko.mapping.fromJS(response, this.enquiriesFeedData);
                    cacheLastRes = response;
                });
            }, this.pollingFrequency);
        }

        currentStage() {
            let stage: Stage = Stage['New'];

            return stage;
        }
    }

    hirespace.App.subscribe('EnquiriesFeedController', EnquiriesFeedController, true);
}