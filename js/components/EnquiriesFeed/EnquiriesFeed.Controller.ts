module hirespace {
    'use strict';

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
        venue: string;
        word: string;
    }

    export class EnquiriesFeedController {
        private pollingFrequency: number = hirespace.Debug.getEnvironment() == 'development' ? 36000 * 60 : 36000;

        enquiriesFeedData: KnockoutMapping;
        enquiriesFeedDataPromise: () => JQueryPromise<any>;

        constructor() {
            hirespace.Modal.listen();

            let cacheLastRes: IEnquiriesFeedData;

            // Initial Data to be referenced by a global variable
            this.enquiriesFeedData = ko.mapping.fromJS({
                _id: '1a',
                budget: '3,000',
                customer: {
                    company: 'Company Ltd.',
                    email: 'jamessmith@company.co.uk',
                    mobile: '+44 (0) 7894 846483',
                    name: 'James Smith',
                    phone: ''
                },
                date: {
                    finishdate: '20 August 2015',
                    flexible: false,
                    startdate: '18 August 2015',
                },
                message: 'We also require overnight bedrooms, breakout rooms and WIFI. We need a registration area too including staffing, badges etc.',
                people: 20,
                status: 'New',
                time: {
                    finishtime: '11:00 pm',
                    flexible: false,
                    starttime: '10:00 am',
                },
                venue: 'The Barbican',
                word: 'Conference'
            });

            this.enquiriesFeedDataPromise = () => {
                return $.get('https://hirespacesprintvenues.azurewebsites.net/Enquiries/Enquiry/lolz');
            };

            setInterval(() => {
                this.enquiriesFeedDataPromise().then((response: IEnquiriesFeedData) => {
                    if (_.isEqual(response, cacheLastRes)) {
                        console.debug('View update skipped');

                        return false;
                    }

                    ko.mapping.fromJS(response, this.enquiriesFeedData);
                    cacheLastRes = response;

                    hirespace.Logger.info(response);
                });
            }, this.pollingFrequency);
        }
    }

    hirespace.App.subscribe('EnquiriesFeedController', EnquiriesFeedController, true);
}