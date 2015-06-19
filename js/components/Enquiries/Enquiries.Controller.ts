module hirespace {
    'use strict';

    declare
    var initBookingData: IBookingData;

    interface IUiConfig {
        defaultStage: string;
        prevStage: string;
    }

    export class EnquiriesController {
        private pollingFrequency: number = 60000;

        bookingData: IBookingData;
        bookingDataObservable: KnockoutMapping;
        uiConfig: IUiConfig;

        constructor() {
            hirespace.Modal.listen();
            hirespace.Tabs.listen();

            this.initUiConfig();
            this.initBookingData();

            this.ui();

            setInterval(() => {
                this.bookingDataPromise().then((response: IBookingData) => {
                    // @TODO
                    // all API methods should have a common class intermediary taking care of sending the same sort of
                    // config and parsing responses into an object with shared Interface
                    let hsResponse: IBookingData = this.parseBookingData(response);

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

            this.bookingData = this.parseBookingData(initBookingData);
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
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + '2WscqXhWtbhwxTWhs', {
                type: 'get', headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode('q2iJd9ei8sz2Z6xpe')
                }
            });
        }

        updateBookingDataPromise(updateData: any): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + '2WscqXhWtbhwxTWhs', {
                // @TODO
                // resolve after we have a functioning API
                data: updateData, type: 'put', headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode('q2iJd9ei8sz2Z6xpe')
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

        // @TODO
        // refactor cruft and write unit tests
        parseBookingData(bookingData: IBookingData): IBookingData {
            bookingData.date.startdate = moment(bookingData.date.startdate).format('MMM Do YY');
            bookingData.date.finishdate = moment(bookingData.date.finishdate).format('MMM Do YY');
            bookingData.time.starttime = moment(bookingData.time.starttime).format('h:mm');
            bookingData.time.finishtime = moment(bookingData.time.finishtime).format('h:mm');
            bookingData.customer.company = bookingData.customer.company ? bookingData.customer.company : 'No Company';

            return bookingData;
        }

        // @TODO
        // implement differently
        ui() {
          $('.toggle-enquiries-feed').click(e => {
              $('.enquiries-feed, .toggle-enquiries-feed .close').toggleClass('active');
          });
        }
    }

    hirespace.App.subscribe('EnquiriesController', EnquiriesController, true);
}