module hirespace {
    'use strict';

    declare
    var initBookingData: IBookingData;

    interface IUiConfig {
        defaultStage: string;
        prevStage: string;
    }

    export class EnquiriesController {
        private pollingFrequency: number = 500000;

        bookingData: IBookingData;
        bookingDataObservable: KnockoutMapping;
        uiConfig: IUiConfig;

        constructor() {
            hirespace.Modal.listen();
            hirespace.Tabs.listen();
            hirespace.ToggleElem.listen();

            this.initUiConfig();
            this.initBookingData();

            setInterval(() => {
                Rx.Observable.fromPromise(this.bookingDataPromise())
                    .subscribe(d => {
                        let hsResponse: IBookingData = hirespace.EnquiriesController.parseBookingData(d);

                        if (_.isEqual(hsResponse, this.bookingData)) {
                            hirespace.Logger.debug('View update skipped');

                            return false;
                        }

                        this.uiConfig.prevStage = this.bookingData.stage.name;
                        this.updateBookingData(hsResponse);
                    }, f => console.error(f));
            }, this.pollingFrequency);

            $('.hs-to-step').click(e => {
                let updateData = hirespace.UpdateParser.getObject($(e.target).attr('update'));

                Rx.Observable.fromPromise(this.updateBookingDataPromise(updateData))
                    .subscribe(d => {
                        let hsResponse: IBookingData = hirespace.EnquiriesController.parseBookingData(d);

                        this.uiConfig.prevStage = this.bookingData.stage.name;

                        this.updateBookingData(hsResponse);
                    }, f => hirespace.Logger.error(f));
            });
        }

        initBookingData() {
            hirespace.Logger.debug('Booking Data initialised from a local source');

            this.bookingData = hirespace.EnquiriesController.parseBookingData(initBookingData);
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

            $('.toggle-enquiries-feed').click(e => {
                $('.enquiries-feed, .toggle-enquiries-feed .close').toggleClass('active');
            });
        }

        // @TODO
        // look into ifModified option
        bookingDataPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + '2WscqXhWtbhwxTWhs', {
                method: 'GET', headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode('q2iJd9ei8sz2Z6xpe')
                }
            });
        }

        updateBookingDataPromise(updateData: any): JQueryGenericPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + '2WscqXhWtbhwxTWhs', {
                // @TODO
                // resolve after we have a functioning API
                data: updateData, method: 'PUT', headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode('q2iJd9ei8sz2Z6xpe')
                }
            });
        }

        updateProgressBar(toStage?: string) {
            // @TODO
            // redundant in prod -> due to testing only
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

        // @TODO
        // refactor cruft
        static parseBookingData(bookingData: IBookingData): IBookingData {
            let startDate = new Date(bookingData.date.startdate);
            let finishDate = new Date(bookingData.date.finishdate);

            bookingData.date.startdate = moment(startDate).format('MMM Do YY');
            bookingData.date.finishdate = moment(finishDate).format('MMM Do YY');
            bookingData.customer.company = bookingData.customer.company ? bookingData.customer.company : 'No Company Name';
            bookingData.customer.firstName = _.first(bookingData.customer.name.split(' '));

            return bookingData;
        }
    }

    hirespace.App.subscribe('EnquiriesController', EnquiriesController, true);
}