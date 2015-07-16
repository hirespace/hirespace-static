module hirespace {
    'use strict';

    export var enquiriesFeedStages: IStageStatus = {
        'New': 'new',
        'In Progress': 'in-progress',
        'Needs Archiving': 'needs-archiving',
        'Archived': 'archived'
    };

    export var enquiriesFeedStatuses: IStage = {
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

    export interface IArchived {
        price: number;
        priceType: string;
        reasonLost: string;
    }

    interface IBookingStage {
        // @TODO
        // change to enum?
        name: string; // New / In Progress / Needs Archiving / Archived
        option?: IArchived; // Confirmed / Closed / Pending | IArchived
    }

    interface ICustomer {
        _id: string;
        company?: string;
        email: string;
        firstName?: string;
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
        // @TODO
        // is this mandatory?
        spaceName?: string;
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
        guid: string;
        message: string;
        messageExceedsLimit?: boolean;
        people: number;
        stage: IBookingStage;
        status: string;
        suggestedCriteria?: ISuggestedCriteria;
        time: ITime;
        // @TODO
        // resolve this to Date only?
        timeToFollowUp: string | Date;
        venue: IVenue;
        word: string;
        internalNote?: string;
    }
}