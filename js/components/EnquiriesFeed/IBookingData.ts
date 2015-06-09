module hirespace {
    'use strict';

    // @TODO
    // think about implementing the correct stage and status schemas
    enum Stage {'New' = 1, 'In Progress', 'Needs Archiving', 'Archived'}
    enum Status {'Won' = 1, 'Lost', 'Voided'}

    interface ICustomer {
        company: string;
        email: string;
        mobile?: string | boolean;
        name: string;
        phone?: string | boolean;
    }

    interface IDate {
        finishdate?: string;
        flexible: boolean;
        startdate: string;
    }

    interface ITime {
        finishtime?: string;
        flexible: boolean;
        starttime: string;
    }

    interface IVenue {
        manager: string;
        name: string;
        team: string;
    }

    interface ISuggestedCriteria {
        budget?: number;
        date?: IDate;
        people?: number;
        time?: ITime;
    }

    export interface IBookingData {
        _id: string;
        budget: number;
        customer: ICustomer;
        date: IDate;
        message: string;
        people: number;
        stage: string;
        status: string;
        suggestedCriteria: ISuggestedCriteria;
        time: ITime
        venue: IVenue;
        word: string;
        internalNote: string;
    }
}