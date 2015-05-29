module hirespace {
    'use strict';

    export interface IEnquiriesFeedData {
        enquiry: {
            id: string;
            status: string;
            budget: number;
            date: {
                startDate: string;
                endDate?: string;
                flexible: boolean;
            };
            time: {
                startTime: string;
                endTime?: string;
                flexible: boolean;
            }
            numberOfPeople: number;
            message: string;
        }
        customer: {
            name: string;
            email: string;
            tel: string;
            company: string;
        }
    }

    export class EnquiriesFeedController {
        // @TODO
        // why does IEnquiriesFeedData not work?
        enquiriesFeedData: KnockoutObservableArray<{}>;
        enquiriesFeedDataPromise: () => JQueryPromise<any>;

        constructor() {
            this.enquiriesFeedData = ko.observableArray();

            this.enquiriesFeedDataPromise = () => {
                return $.get('https://hirespacesprintvenues.azurewebsites.net/Enquiries/Enquiry/lolz');
            };

            this.enquiriesFeedDataPromise().then((response: IEnquiriesFeedData) => {
                this.enquiriesFeedData.push(response);
                console.log(response);
            });
        }
    }

    hirespace.App.subscribe('EnquiriesFeedController', EnquiriesFeedController, true);
}