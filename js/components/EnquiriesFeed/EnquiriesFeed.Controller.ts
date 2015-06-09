module hirespace {
    'use strict';

    declare
    var initBookingData: IBookingData;

    //interface IUiConfigSection {
    //    view: string;
    //}

    interface IUiConfig {
        defaultStage: string;
    }

    export class EnquiriesFeedController {
        private pollingFrequency: number = 60000;

        bookingData: IBookingData;
        bookingDataObservable: KnockoutMapping;
        uiConfig: IUiConfig;

        constructor() {
            hirespace.Modal.listen();

            this.initBookingData();
            this.initUiConfig();

            setInterval(() => {
                this.bookingDataPromise().then((response: IBookingData) => {
                    if (_.isEqual(response, this.bookingData)) {
                        hirespace.Logger.debug('View update skipped');

                        return false;
                    }

                    this.updateBookingData(response);
                });
            }, this.pollingFrequency);
        }

        initBookingData() {
            this.bookingData = initBookingData;
            this.bookingDataObservable = ko.mapping.fromJS(this.bookingData);

            hirespace.Logger.debug('Booking Data initialised from a local source');
        }

        initUiConfig() {
            this.uiConfig = {
                defaultStage: _.first(_.keys(enquiriesFeedStages))
            };

            this.updateProgressBar(this.uiConfig.defaultStage);
        }

        bookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiRoutes().bookings.getData, {type: 'get'});
        }

        updateBookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiRoutes().bookings.updateData, {type: 'get'});
        }

        updateProgressBar(toStage: string) {
            let uiClass = enquiriesFeedStages[toStage];

            $('.page-enquiries-feed .progress-bar').addClass(uiClass);

            return uiClass;
        }

        updateBookingData(newData: IBookingData) {
            hirespace.Logger.debug('New Booking Data loaded');

            ko.mapping.fromJS(newData, this.bookingDataObservable);
            this.bookingData = newData;
        }
    }

    hirespace.App.subscribe('EnquiriesFeedController', EnquiriesFeedController, true);
}