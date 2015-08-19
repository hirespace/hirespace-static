declare var filepicker: {
    setKey: Function;
    pickMultiple: Function;
};

module hirespace {
    'use strict';

    declare var initBookingData: IBookingData;

    interface IUiConfig {
        defaultStage: string;
        prevStage: string;
    }

    export class EnquiriesController {
        private attachments: Array<{}>;
        private guid: string;
        private pollingFrequency: number = 30000;

        editBookingData: string;
        bookingData: IBookingData;
        uiConfig: IUiConfig;
        EnquiriesFeed: hirespace.EnquiriesFeed;

        constructor() {
            hirespace.Modal.listen();
            hirespace.Tabs.listen();
            hirespace.ToggleElem.listen();

            if (initBookingData) {

                this.initUiConfig();
                this.initBookingData();

                setInterval(() => {
                    this.bookingDataPromise().then(d => {
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
                            toName: this.bookingData.customer.name,
                            subject: 'RE: ' + this.bookingData.word + ' at ' + this.bookingData.venue.name,
                            message: $('#modalQuickReply textarea').val(),
                            attachments: _.isUndefined(this.attachments) ? [] : this.attachments
                        };

                        this.sendEmailPromise(emailData).then(response => {
                            hirespace.Notification.generate('Your Message was successfully sent. The enquiry is moved to In Progress', 'in-progress');
                            hirespace.Logger.info(response);

                            this.resolveUpdateBookingData(updateData, true);
                        }, response => {
                            if (response.status == 200) {
                                hirespace.Notification.generate('Your Message was successfully sent. The enquiry is moved to In Progress', 'in-progress');
                                hirespace.Logger.info(response);

                                this.resolveUpdateBookingData(updateData, true);
                            } else {
                                hirespace.Notification.generate('There was an error sending your email.', 'error');
                                hirespace.Logger.error(response);
                            }
                        });

                        return false;
                    }

                    if ($(e.target).hasClass('archive')) {
                        switch (updateData.status) {
                            case 'won':
                                updateData.priceType = $('.confirm-spend .tabs .active').attr('data-value');
                                updateData.price = parseFloat($('.confirm-spend input').val().replace(/£/g, ''));

                                let checkPrice = hirespace.Form.Validate.all(updateData.price, ['numeric:positiveOnly']);

                                if (checkPrice.valid !== true) {
                                    hirespace.Logger.error(checkPrice.error, true);
                                    errors.push('price');
                                }

                                break;
                            case 'lost':
                                updateData.reasonLost = $('.confirm-reason-lost .tabs .active').attr('data-value');
                                break;
                            default:
                                hirespace.Logger.error('Status ' + updateData.status + ' not allowed.');
                                return false;
                        }

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

                $('.toggle-edit').click((e) => {
                    let editOnly = $(e.currentTarget).attr('edit-only');

                    this.editBookingData = _.isUndefined(editOnly) ? 'all' : editOnly;
                    hirespace.View.updateView(this, '#modalSuggestEdits');
                });

                $('#saveSuggestedEdits').click(() => {
                    let inputs = $('#formSuggestedEdits input');

                    this.saveSuggestedEdits(inputs);
                });
            }
        }

        resolveUpdateBookingData(updateData: any, ignoreNotification?: boolean) {
            this.updateBookingDataPromise(updateData).then(d => {
                let hsResponse: IBookingData = hirespace.EnquiriesController.parseBookingData(d);

                ignoreNotification = (hsResponse.stage.name == this.bookingData.stage.name) ? true : ignoreNotification;

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
            return $.ajax({
                contentType: "text/plain",
                crossDomain: true,
                data: JSON.stringify({guid: this.guid}),
                dataType: 'json',
                method: 'POST',
                url: hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().getEnquiry + this.bookingData._id
            });
        }

        sendEmailPromise(emailData: any): JQueryPromise<any> {
            return $.ajax({
                contentType: "text/plain",
                crossDomain: true,
                data: JSON.stringify(emailData),
                dataType: 'json',
                method: 'POST',
                url: hirespace.Config.getEnquirySendEmailApi()
            });
        }

        updateBookingDataPromise(updateData: any): JQueryGenericPromise<any> {
            return $.ajax({
                contentType: "text/plain",
                crossDomain: true,
                data: JSON.stringify({guid: this.guid, enquiry: updateData}),
                dataType: 'json',
                method: 'POST',
                url: hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().updateEnquiry + this.bookingData._id
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
            this.EnquiriesFeed.nRenderView(this.bookingData.stage.name, true, false, this.bookingData, true);
        }

        updateUi() {
            this.updateProgressBar();
            hirespace.View.updateView(this, '.enquiry-actions, .modal-backdrop');
        }

        // @TODO
        // refactor cruft
        static parseBookingData(bookingData: IBookingData): IBookingData {
            bookingData.customer.firstName = _.first(bookingData.customer.name.split(' '));
            bookingData.word = _.isEmpty(bookingData.word) ? 'Enquiry' : bookingData.word;

            let messageWords = bookingData.message ? bookingData.message.match(/(\w+)/g) : [];
            // @TODO
            // abstract into a config
            bookingData.messageExceedsLimit = messageWords.length > 85;

            return bookingData;
        }

        saveSuggestedEdits(inputs) {
            let payload = {
                    suggestedEdits: {}
                },
                rules,
                name,
                value,
                checkAgainstUpdateValues: Array<string> = [];

            switch (this.editBookingData) {
                case 'date':
                    checkAgainstUpdateValues = ['startdate', 'finishdate'];
                    break;
                case 'time':
                    checkAgainstUpdateValues = ['starttime', 'finishtime'];
                    break;
                default:
                    checkAgainstUpdateValues.push(this.editBookingData);
                    break;
            }

            $('#modalSuggestEdits').find('.error').remove();

            let formValid = [];

            _.forEach(inputs, input => {
                name = $(input).attr('name');
                value = $(input).val();
                rules = $(input).attr('rule');

                if (_.contains(checkAgainstUpdateValues, name) || _.contains(checkAgainstUpdateValues, 'all')) {
                    let validateForm = hirespace.Form.Validate.all(value, JSON.parse(rules));

                    if (!validateForm.valid) {
                        let errMsg = '';

                        _.forEach(validateForm.error, errorMessage => errMsg += '<strong class="error"><i class="fa fa-warning"></i> ' + errorMessage + '</div>');

                        $(input).parent().append(errMsg);
                        formValid.push(false);
                    } else {
                        let updateVal;

                        // @TODO create a separate class for testing this
                        if (value !== this.bookingData[name]) {
                            if (name == 'finishdate' || name == 'startdate') {
                                updateVal = EnquiriesController.dateToUNIX(value);
                            } else {
                                if (name == 'starttime' || name == 'finishtime') {
                                    updateVal = EnquiriesController.parseTime(value);
                                } else {
                                    updateVal = value;
                                }
                            }

                            payload.suggestedEdits[name] = (updateVal.toString().length == 0 || _.isNaN(updateVal)) ? false : updateVal;
                        }
                    }
                }
            });

            if (_.values(payload).length > 0 && !_.contains(formValid, false)) {
                this.resolveUpdateBookingData(payload);

                $('.modal, .modal-backdrop').addClass('is-hidden');
            }
        }

        static parseTime(value: string): string {
            let updateVal = new Date(moment(value, 'HH:mm A').format())
                .toTimeString()
                .split(' ')[0]
                .split(':');

            updateVal.pop();

            return updateVal.join(':');
        }

        static dateToUNIX(value: string): number {
            return Date.parse(moment(value, ['DD MMMM YYYY', 'DD-MM-YYYY']).format());
        }
    }

    hirespace.App.subscribe('EnquiriesController', EnquiriesController);
}