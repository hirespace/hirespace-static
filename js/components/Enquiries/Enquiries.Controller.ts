declare
var filepicker: {
    setKey: Function;
    pickMultiple: Function;
};

module hirespace {
    'use strict';

    declare
    var initBookingData: IBookingData;

    interface IUiConfig {
        defaultStage: string;
        prevStage: string;
    }

    export class EnquiriesController {
        private attachments: Array<{}>;
        private guid: string;
        private pollingFrequency: number = 30000;

        bookingData: IBookingData;
        bookingDataObservable: KnockoutMapping;
        uiConfig: IUiConfig;
        EnquiriesFeed: hirespace.EnquiriesFeed;

        constructor() {
            hirespace.Modal.listen();
            hirespace.Tabs.listen();
            hirespace.ToggleElem.listen();

            this.initUiConfig();
            this.initBookingData();

            setInterval(() => {
                Rx.Observable.fromPromise(this.bookingDataPromise())
                    .retry(3)
                    .subscribe(d => {
                        let hsResponse: IBookingData = hirespace.EnquiriesController.parseBookingData(d);

                        if (_.isEqual(hsResponse.stage.name, this.bookingData.stage.name)) {
                            hirespace.Logger.debug('View update skipped');
                        } else {
                            this.uiConfig.prevStage = this.bookingData.stage.name;
                            this.updateBookingData(hsResponse);
                        }
                    }, f => hirespace.Logger.error(f));
            }, this.pollingFrequency);

            $('#pickFiles').click((e) => {
                filepicker.setKey("A7pkhw39DQ7a61Ax3HjlIz");

                filepicker.pickMultiple(
                    {services: ['COMPUTER', 'FACEBOOK', 'BOX', 'IMGUR', 'CLOUDDRIVE']}, (Blobs: Array<{}>) => {
                        this.attachments = Blobs;
                        $(e.target).html(Blobs.length + ' files attached');
                    }, error => hirespace.Logger.error(error));
            });

            $('.hs-to-step').click(e => {
                let updateData = hirespace.UpdateParser.getObject($(e.target).attr('update')),
                    errors = [],
                    emailData: boolean | {} = false;

                if ($(e.target).hasClass('send-email')) {
                    emailData = {
                        toEmailAddress: this.bookingData.customer.email,
                        subject: 'RE: ' + this.bookingData.word + ' at ' + this.bookingData.venue.name,
                        message: $('#modalQuickReply textarea').val(),
                        attachments: _.isUndefined(this.attachments) ? [] : this.attachments
                    };

                    Rx.Observable.fromPromise(this.sendEmailPromise(emailData))
                        .do(() => {
                            hirespace.Logger.info(emailData);
                        })
                        .retry(3)
                        .subscribe(response => {
                            hirespace.Notification.generate('Your Message was successfully sent. The enquiry is moved to In Progress', 'in-progress');
                            this.resolveUpdateBookingData(updateData, true);
                        }, f => {
                            hirespace.Notification.generate('There was an error sending your email.', 'error');
                            hirespace.Logger.error(f);
                        });

                    return false;
                }

                if ($(e.target).hasClass('archive')) {
                    switch (updateData.status) {
                        case 'won':
                            updateData.priceType = $('.confirm-spend .tabs .active').attr('data-value');
                            updateData.price = _.parseInt($('.confirm-spend input').val().replace(/£/g, ''));
                            break;
                        case 'lost':
                            updateData.reasonLost = $('.confirm-reason-lost .tabs .active').attr('data-value');
                            break;
                        default:
                            hirespace.Logger.error('Status ' + updateData.status + ' not allowed.');
                            return false;
                    }

                    // @TODO
                    // error handling using the UI - notifications
                    _.forEach(updateData, (value, key) => {
                        if (!value) {
                            hirespace.Logger.error('The value of ' + key + ' is invalid or empty', true);
                            errors.push(key);
                        }
                    });
                }

                if (errors.length > 0) {
                    return false;
                }

                this.resolveUpdateBookingData(updateData);
            });

            $('#showFullMessage').click((e) => {
                $(e.target).html(($(e.target).html() == 'Show more') ? 'Show less' : 'Show more');
                $('#showFullMessageContainer').toggleClass('show-all');
            });
        }

        resolveUpdateBookingData(updateData: any, ignoreNotification?: boolean) {
            Rx.Observable.fromPromise(this.updateBookingDataPromise(updateData))
                .retry(3)
                .subscribe(d => {
                    let hsResponse: IBookingData = hirespace.EnquiriesController.parseBookingData(d);

                    this.uiConfig.prevStage = this.bookingData.stage.name;

                    this.updateBookingData(hsResponse);

                    if (!ignoreNotification) {
                        hirespace.Notification.generate(updateData.timeToFollowUp ?
                            'Thanks for letting us know the enquiry is still pending. We\'ll follow up again in two weeks.' : 'Status has been changed to <strong>' + hsResponse.stage.name + '</strong>!', enquiriesFeedStages[hsResponse.stage.name]);
                    }
                }, f => hirespace.Logger.error(f));
        }

        initBookingData() {
            hirespace.Logger.debug('Booking Data initialised from a local source');

            this.bookingData = hirespace.EnquiriesController.parseBookingData(initBookingData);
            this.bookingDataObservable = ko.mapping.fromJS(this.bookingData);

            this.guid = this.bookingData.guid;

            this.updateUi();

            this.EnquiriesFeed = new EnquiriesFeed(this.bookingData);
        }

        // @TODO
        // investigate if this method is actually needed
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
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + this.bookingData._id, {
                method: 'GET', headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode(this.guid)
                }
            });
        }

        sendEmailPromise(emailData: any): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getEnquirySendEmailApi(), {
                //contentType: "application/json; charset=utf-8",
                data: JSON.stringify(emailData),
                method: 'POST'
            });
        }

        updateBookingDataPromise(updateData: any): JQueryGenericPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookings + this.bookingData._id, {
                data: JSON.stringify(updateData),
                contentType: "application/json; charset=utf-8",
                method: 'PUT',
                headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode(this.guid)
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

            this.bookingData = newData;
            this.bookingData.guid = this.guid;

            this.updateUi();
            this.EnquiriesFeed.renderView(this.bookingData.stage.name, true, () => {
            }, false, this.bookingData);
        }

        updateUi() {
            this.updateProgressBar();
            hirespace.View.updateView(this, '.enquiry-actions, .modal-backdrop');
        }

        // @TODO
        // refactor cruft
        static parseBookingData(bookingData: IBookingData): IBookingData {
            bookingData.customer.firstName = _.first(bookingData.customer.name.split(' '));
            //bookingData.stage.options.price;

            let messageWords = bookingData.message ? bookingData.message.match(/(\w+)/g) : [];
            // @TODO
            // abstract into a config
            bookingData.messageExceedsLimit = messageWords.length > 85;

            return bookingData;
        }
    }

    hirespace.App.subscribe('EnquiriesController', EnquiriesController, true);
}