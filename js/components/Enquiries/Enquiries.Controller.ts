module hirespace {
    'use strict';

    declare
    var initBookingData: IBookingData;

    interface IUiConfig {
        defaultStage: string;
        prevStage: string;
    }

    export class EnquiriesController {
        private pollingFrequency: number = 600000;

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

                    hsResponse.date.startdate = moment(hsResponse.date.startdate).format('MMM Do YY');
                    hsResponse.date.finishdate = moment(hsResponse.date.finishdate).format('MMM Do YY');

                    hsResponse.time.starttime = moment(hsResponse.time.starttime).format('h:mm');
                    hsResponse.time.finishtime = moment(hsResponse.time.finishtime).format('h:mm');


                    if (_.isEqual(hsResponse, this.bookingData)) {
                        hirespace.Logger.debug('View update skipped');

                        return false;
                    }

                    this.uiConfig.prevStage = this.bookingData.stage.name;
                    this.updateBookingData(hsResponse);
                });
            }, this.pollingFrequency);

            $('.next-step').click(e => {
                let toStep = $(e.target).attr('to-step');
                let updateData = hirespace.UpdateParser.getObject($(e.target).attr('update'));

                this.updateBookingDataPromise(updateData).then(() => {
                    this.uiConfig.prevStage = this.bookingData.stage.name;
                    this.bookingData.stage.name = toStep;

                    this.updateBookingData(this.bookingData);
                });
            });

            $('[data-toggle]').click(e => {
                let toggleAttrs = $(e.target).attr('data-toggle');

                hirespace.View.toggleAttrs(toggleAttrs);
            });
        }

        initBookingData() {
            hirespace.Logger.debug('Booking Data initialised from a local source');

            this.bookingData = initBookingData;

            this.bookingData.date.startdate = moment(this.bookingData.date.startdate).format('MMM Do YY');
            this.bookingData.date.finishdate = moment(this.bookingData.date.finishdate).format('MMM Do YY');

            this.bookingData.time.starttime = moment(this.bookingData.time.starttime).format('h:mm');
            this.bookingData.time.finishtime = moment(this.bookingData.time.finishtime).format('h:mm');

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
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + '56M4S8tNrujZCsvkY', {
                type: 'get', headers: {
                    Authorization: 'Basic cFltU1B3c3VMOE40NnlqaWs='
                    //Authorization: 'Basic ' + btoa('usr' + ':' + 'pwd')
                }
            });
        }

        updateBookingDataPromise(updateData: any): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + '56M4S8tNrujZCsvkY', {
                // @TODO
                // resolve after we have a functioning API
                data: updateData, type: 'put', headers: {
                    Authorization: 'Basic cFltU1B3c3VMOE40NnlqaWs='
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