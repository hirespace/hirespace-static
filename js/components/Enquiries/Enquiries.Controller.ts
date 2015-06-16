module hirespace {
    'use strict';

    declare
    var initBookingData: IBookingData;

    interface IUiConfig {
        defaultStage: string;
        prevStage: string;
    }

    export class EnquiriesController {
        private pollingFrequency: number = 30000;

        bookingData: IBookingData;
        bookingDataObservable: KnockoutMapping;
        uiConfig: IUiConfig;

        constructor() {
            hirespace.Modal.listen();
            hirespace.Tabs.listen();

            this.initUiConfig();
            this.initBookingData();

            setInterval(() => {
                this.bookingDataPromise().then((response: string) => {
                    // @TODO
                    // all API methods should have a common class intermediary taking care of sending the same sort of
                    // config and parsing responses into an object with shared Interface
                    let hsResponse: IBookingData = JSON.parse(response);

                    if (_.isEqual(hsResponse, this.bookingData)) {
                        hirespace.Logger.debug('View update skipped');

                        return false;
                    }

                    this.uiConfig.prevStage = this.bookingData.stage.name;
                    this.updateBookingData(hsResponse);
                });
            }, this.pollingFrequency);

            $('.next-step').click((e) => {
                let toStep = $(e.target).attr('data-step');

                this.updateBookingDataPromise().then(() => {
                    this.uiConfig.prevStage = this.bookingData.stage.name;
                    this.bookingData.stage.name = toStep;

                    this.updateBookingData(this.bookingData);
                });
            });

            $('[data-toggle]').click((e) => {
                let toggleAttrs = $(e.target).attr('data-toggle');

                hirespace.View.toggleAttrs(toggleAttrs);
            });
        }

        initBookingData() {
            hirespace.Logger.debug('Booking Data initialised from a local source');

            this.bookingData = initBookingData;
            this.bookingDataObservable = ko.mapping.fromJS(this.bookingData);

            this.updateUi();
        }

        // @TODO
        // investigate if this mehtod is actually needed
        initUiConfig() {
            this.uiConfig = {
                defaultStage: _.first(_.keys(enquiriesFeedStages)),
                prevStage: _.first(_.keys(enquiriesFeedStages))
            };
        }

        bookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + 'QJ8tFLRfe5Khgvurt', {
                type: 'get', headers: {
                    Authorization: 'Basic cUFES1lybW03SnA4WlhSWlQ='
                    //Authorization: 'Basic ' + btoa('usr' + ':' + 'pwd')
                }
            });
        }

        updateBookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + 'QJ8tFLRfe5Khgvurt', {
                // @TODO
                // resolve after we have a functioning API
                type: 'put', headers: {
                    Authorization: 'Basic cUFES1lybW03SnA4WlhSWlQ='
                    //Authorization: 'Basic ' + btoa('usr' + ':' + 'pwd')
                }
            });
        }

        updateProgressBar(toStage?: string) {
            if (!toStage) {
                toStage = this.bookingData.stage.name;
            }

            let redundantUiClass = enquiriesFeedStages[this.uiConfig.prevStage],
                uiClass = enquiriesFeedStages[toStage];

            $('.page-enquiries .progress-bar, .page-enquiries .label.stage')
                .removeClass(redundantUiClass)
                .addClass(uiClass);

            // Due to testing
            return uiClass;
        }

        updateBookingData(newData: IBookingData) {
            hirespace.Logger.debug('New Booking Data loaded');

            ko.mapping.fromJS(newData, this.bookingDataObservable);
            this.bookingData = newData;

            this.updateUi();
        }

        updateUi() {
            this.updateProgressBar();
            hirespace.View.updateView(this);
        }
    }

    hirespace.App.subscribe('EnquiriesController', EnquiriesController, true);
}