module hirespace {
    'use strict';

    declare
    var initBookingData: IBookingData;

    interface IUiConfigSection {
        progressBar: string;
        view: string;
    }

    interface IUiConfig {
        'New': IUiConfigSection;
        'In Progress': IUiConfigSection;
        'Needs Archiving': IUiConfigSection;
        'Archived': IUiConfigSection;
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
                'New': {
                    progressBar: 'new',
                    view: 'new'
                },
                'In Progress': {
                    progressBar: 'in-progress',
                    view: 'in-progress'
                },
                'Needs Archiving': {
                    progressBar: 'needs-archiving',
                    view: 'needs-archiving'
                },
                'Archived': {
                    progressBar: 'archived',
                    view: 'archived'
                }
            };

            this.updateProgressBar('New');
        }

        bookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiRoutes().bookings.getData, {type: 'get'});
        }

        updateBookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiRoutes().bookings.updateData, {type: 'get'});
        }

        updateProgressBar(toStage: string) {
            let uiClass = this.uiConfig[toStage].progressBar;

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