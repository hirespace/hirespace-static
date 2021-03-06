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
        recentStory: any;
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

    class BookingDataStageOption {
        price: number;
        priceType: string;
        reasonLost: string;
        needsArchiving: string;

        // @TODO change any
        constructor(data: any) {
            if (_.isString(data)) {
                this.needsArchiving = data;
            } else {
                this.price = data.price;
                this.priceType = data.priceType;
                this.reasonLost = data.reasonLost;
                this.needsArchiving = data.needsArchiving;
            }
        }
    }

    class BookingDataStage {
        name: string;
        option: BookingDataStageOption;

        // @TODO change any
        constructor(data: any) {
            this.name = data.name;
            this.option = data.option ? new BookingDataStageOption(data.option) : undefined;
        }
    }

    class BookingDataVenue {
        manager: string;
        name: string;
        spaceName: string;

        // @TODO change any
        constructor(data: any) {
            this.manager = data.manager;
            this.name = data.name;
            this.spaceName = data.spaceName;
        }
    }

    class BookingDataCustomer {
        _id: string;
        company: string;
        email: string;
        firstName: string;
        mobile: string;
        name: string;
        phone: string;

        // @TODO change any
        constructor(data: any) {
            this._id = data._id;
            this.company = data.company;
            this.email = data.email;
            this.firstName = data.name; // @TODO this will be a method
            this.mobile = data.mobile;
            this.name = data.name;
            this.phone = data.phone;
        }
    }

    class BookingDataDate {
        finishdate: string;
        flexible: boolean;
        startdate: string;

        // @TODO change any
        constructor(data: any) {
            this.finishdate = data.finishdate;
            this.flexible = data.flexible;
            this.startdate = data.startdate;
        }
    }

    class BookingDataTime {
        finishtime: string;
        flexible: boolean;
        starttime: string;

        // @TODO change any
        constructor(data: any) {
            this.finishtime = data.finishtime;
            this.flexible = data.flexible;
            this.starttime = data.starttime;
        }
    }

    export class BookingDataStory {
        _id: string;
        timestamp: number;
        action: string;
        storytext: string;
        date: string;
        time: string;

        // @TODO change any
        constructor(data: any) {
            this._id = data._id;
            this.action = data.action;
            this.storytext = data.storytext;
            this.timestamp = data.timestamp;
            this.time = BookingDataStory.parseTimestamp(data.timestamp);
        }

        private static parseTimestamp(value: number): string {
            return moment(new Date(value)).format("DD MMM YYYY, hh:mm a");
        }
    }

    export class BookingData {
        private static messageWordCountLimit = 85;

        _id: string;
        budget: number;
        customer: BookingDataCustomer;
        date: BookingDataDate;
        guid: string;
        internalNote: string;
        message: string;
        messageExceedsLimit: boolean;
        people: number;
        recentStory: BookingDataStory;
        stage: BookingDataStage;
        status: string;
        time: BookingDataTime;
        timeToFollowUp: Date;
        venue: BookingDataVenue;
        word: string;

        // @TODO change any
        constructor(data: any) {
            this._id = data._id;
            this.budget = data.budget;
            this.customer = data.customer ? new BookingDataCustomer(data.customer) : undefined;
            this.date = data.date ? new BookingDataDate(data.date) : undefined;
            this.guid = data.guid;
            this.internalNote = data.internalNote;
            this.message = data.message;
            this.messageExceedsLimit = BookingData.messageWordCount(data.message) > BookingData.messageWordCountLimit;
            this.people = data.people;
            this.recentStory = data.recentStory ? new BookingDataStory(data.recentStory) : undefined;
            this.stage = data.stage ? new BookingDataStage(data.stage) : undefined;
            this.status = data.status;
            this.time = data.time ? new BookingDataTime(data.time) : undefined;
            this.timeToFollowUp = data.timeToFollowUp;
            this.venue = data.venue ? new BookingDataVenue(data.venue) : undefined;
            this.word = BookingData.formatBookingWord(data.word);

        }

        private static messageWordCount(message: string): number {
            return message ? message.match(/(\w+)/g).length : 0;
        }

        private static formatBookingWord(word: string): string {
            return _.isUndefined(word) ? 'Enquiry' : word;
        }
    }
}