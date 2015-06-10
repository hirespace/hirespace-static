module hirespace {
    'use strict';

    export var enquiriesFeedStages: IStageStatus = {
        'New': 'new',
        'In Progress': 'in-progress',
        'Needs Archiving': 'needs-archiving',
        'Archived': 'archived'
    };

    export var enquiriesFeedStatuses: IStageStatus = {
        'Confirmed': 'confirmed',
        'Closed': 'closed',
        'Voided': 'voided'
    };

    interface IStageStatus {
        [key: string]: string;
    }

    interface IStage {
        [key: string]: string;
    }

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
    }

    interface ISuggestedCriteria {
        budget?: number;
        date?: IDate;
        people?: number;
        time?: ITime;
    }

    export interface IBookingData {
        _id: string;
        budget: string;
        customer: ICustomer;
        date: IDate;
        message: string;
        people: number;
        stage: string;
        status: string;
        suggestedCriteria: ISuggestedCriteria;
        time: ITime;
        timeToFollowUp: Date;
        venue: IVenue;
        word: string;
        internalNote: string;
    }
}