module hirespace {
    'use strict';

    export interface EnquiriesFeedData {
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

    }
}