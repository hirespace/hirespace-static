module hirespace {
    'use strict';

    declare
    var initBookingData: IBookingData;

    interface IUiConfig {
        defaultStage: string;
    }

    export class EnquiriesFeedController {
        private pollingFrequency: number = 10000;

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

            $('.next-step').click((e) => {
                let toStep = $(e.target).attr('data-step');
                this.updateBookingDataPromise().then(() => {
                    this.bookingData.stage = toStep;

                    this.updateBookingData(this.bookingData);
                });
            });
        }

        initBookingData() {
            this.bookingData = initBookingData;
            this.bookingDataObservable = ko.mapping.fromJS(this.bookingData);

            // @TODO
            // this should be under one updateView method
            this.updateProgressBar();
            hirespace.View.updateView(this);

            hirespace.Logger.debug('Booking Data initialised from a local source');
        }

        // @TODO
        // investigate if this mehtod is actually needed
        initUiConfig() {
            this.uiConfig = {
                defaultStage: _.first(_.keys(enquiriesFeedStages))
            };
        }

        bookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiRoutes().bookings.getData, {type: 'get'});
        }

        updateBookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiRoutes().bookings.updateData, {type: 'get'});
        }

        updateProgressBar(toStage?: string) {
            if (!toStage) {
                toStage = this.bookingData.stage;
            }

            let uiClass = enquiriesFeedStages[toStage];

            $('.page-enquiries-feed .progress-bar, .page-enquiries-feed .label.stage').addClass(uiClass);

            // Due to testing
            return uiClass;
        }

        updateBookingData(newData: IBookingData) {
            hirespace.Logger.debug('New Booking Data loaded');

            ko.mapping.fromJS(newData, this.bookingDataObservable);
            this.bookingData = newData;

            // @TODO
            // this should be under one updateView method
            this.updateProgressBar();
            hirespace.View.updateView(this);
        }
    }

    hirespace.App.subscribe('EnquiriesFeedController', EnquiriesFeedController, true);
}