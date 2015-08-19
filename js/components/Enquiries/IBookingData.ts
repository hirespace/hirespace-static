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

    interface ISuggestedEdits {
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
        suggestedEdits?: ISuggestedEdits;
        time: ITime;
        // @TODO
        // resolve this to Date only?
        timeToFollowUp: string | Date;
        venue: IVenue;
        word: string;
        internalNote?: string;
    }

    export class BookingData {
        _id: string;
        budget: number;
        customer: ICustomer;
        date: IDate;
        guid: string;
        internalNote: string;
        message: string;
        messageExceedsLimit: boolean;
        people: number;
        stage: IBookingStage;
        status: string;
        time: ITime;
        timeToFollowUp: string | Date;
        venue: IVenue;
        word: string;

        constructor(data?) {
            this._id = data._id;
            this.budget = data.budget;
            this.customer = {
                _id: data.customer._id,
                company: data.customer.company,
                email: data.customer.email,
                firstName: data.customer.firstName,
                mobile: data.customer.mobile,
                name: data.customer.name,
                phone: data.customer.phone
            };
            this.date = {
                finishdate: data.date.finishdate,
                flexible: data.date.flexible,
                startdate: data.date.startdate
            };
            this.guid = data.guid;
            this.internalNote = data.internalNote;
            this.message = data.message;
            this.messageExceedsLimit = false;
            this.people = data.people;
            this.stage = {
                name: data.stage.name,
                option: {
                    price: data.stage.option.price,
                    priceType: data.stage.option.priceType,
                    reasonLost: data.stage.option.reasonLost,
                    // @TODO to become Closed / Confirmed / ??Pending??
                    needsArchiving: undefined
                }
            };
            this.status = data.status;
            this.time = {
                finishtime: data.time.finishtime,
                flexible: data.time.flexible,
                starttime: data.time.starttime
            };
            this.timeToFollowUp = data.timeToFollowUp;
            this.venue = {
                manager: data.venue.manager,
                name: data.venue.name,
                spaceName: data.venue.spaceName,
            }
        }
    }
}