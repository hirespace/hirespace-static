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
        word: string;
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
                hirespace.Logger.info(response);
            });
        }
    }

    hirespace.App.subscribe('EnquiriesFeedController', EnquiriesFeedController, true);
}