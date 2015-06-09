module hirespace {
    'use strict';

    declare
    var initBookingData: IBookingData;

    export class EnquiriesFeedController {
        private pollingFrequency: number = 5000;

        bookingData: IBookingData;
        bookingDataObservable: KnockoutMapping;

        constructor() {
            hirespace.Modal.listen();

            this.initBookingData();

            setInterval(() => {
                this.bookingDataPromise().then((response: IBookingData) => {
                    if (_.isEqual(response, this.bookingData)) {
                        hirespace.Logger.debug('View update skipped');

                        return false;
                    }

                    hirespace.Logger.debug('New Booking Data loaded');

                    ko.mapping.fromJS(response, this.bookingDataObservable);
                    this.bookingData = response;
                });
            }, this.pollingFrequency);
        }

        initBookingData() {
            this.bookingData = initBookingData;
            this.bookingDataObservable = ko.mapping.fromJS(this.bookingData);
            hirespace.Logger.debug('Booking Data initialised from a local source');
        }

        bookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiRoutes().bookings.getData, {type: 'get'});
        }

        updateBookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiRoutes().bookings.updateData, {type: 'get'});
        }
    }

    hirespace.App.subscribe('EnquiriesFeedController', EnquiriesFeedController, true);
}