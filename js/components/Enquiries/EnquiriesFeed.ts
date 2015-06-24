module hirespace {
    'use strict';

    interface IFeedData {
        page: number;
        limit: number;
    }

    interface IStageCounts {
        [stage: string]: number;
    }

    interface IStageData {
        enquiries: Array<ITemplateData>;
        remaining: number;
    }

    interface ITemplateData {
        _id: string;
        budget: number;
        customerName: string;
        // @TODO
        // make eventDate?
        eventdate: string;
        stage: string;
        venueName: string;
        word: string;
    }

    export interface IEnquiriesFeedData {
        count: IStageCounts;
        current: ITemplateData;
        remaining: number;
    }

    export class EnquiriesFeed {
        initStage: string;
        remainingStages: Array<string>;
        feedData: IEnquiriesFeedData = {
            count: {},
            current: {
                _id: '',
                budget: 0,
                customerName: '',
                eventdate: '',
                stage: '',
                venueName: '',
                word: ''
            },
            remaining: 0
        };

        constructor(private bookingData: IBookingData) {
            this.initStage = bookingData.stage.name;
            this.remainingStages = _.without(_.keys(enquiriesFeedStages), this.initStage, 'Invalid');

            this.feedData.current._id = bookingData._id;
            this.feedData.current.budget = bookingData.budget;
            this.feedData.current.customerName = bookingData.customer.name;
            this.feedData.current.eventdate = bookingData.date.startdate;
            this.feedData.current.stage = bookingData.stage.name;
            this.feedData.current.venueName = bookingData.venue.name;
            this.feedData.current.word = bookingData.word;

            this.initView();
        }

        stagesCountPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookingsStages, {
                method: 'GET', headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode('9ab2da75-a152-4ef8-a953-70c737e39ea5')
                }
            });
        }

        feedDataPromise(stage: string, data: IFeedData): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookingsStages + stage, {
                data: data, method: 'GET', headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode('9ab2da75-a152-4ef8-a953-70c737e39ea5')
                }
            });
        }

        // @TODO create interface
        renderTemplate(data: ITemplateData) {
            return '<li' + (data._id == this.feedData.current._id ? ' class="active"' : '') + '>' +
                '<strong>' + data.customerName + '\'s ' + data.word + '</strong>' +
                '<small>' + data.venueName + ' &bull; ' + data.budget + ' &bull; ' + data.eventdate + '</small>' +
                '</li>';
        }

        renderView(toStage: string, updateCounts?: boolean, callback?: Function) {
            if (updateCounts) {
                this.updateStageCounts();
            }

            // @TODO
            // abstract page and limit to config vars
            Rx.Observable.fromPromise(this.feedDataPromise(toStage, {
                page: 0,
                limit: 5,
                ignore: this.feedData.current._id
            }))
                .subscribe((data: IStageData) => {
                    data.enquiries.unshift(this.feedData.current);

                    let target = $('nav.enquiries-feed .sub ul.' + enquiriesFeedStages[toStage]);

                    target.html('');

                    _.forEach(data.enquiries, entry => {
                        target.append(this.renderTemplate(entry));
                    });

                    this.feedData.current.stage = toStage;
                    this.feedData.remaining = data.remaining;

                    hirespace.View.updateView(this, 'nav.enquiries-feed');

                    if (callback) {
                        callback();
                    }
                });
        }

        updateStageCounts() {
            Rx.Observable.fromPromise(this.stagesCountPromise())
                .subscribe((counts: IStageCounts) => {
                    _.forEach(counts, (count, stageName) => {
                        this.feedData.count[enquiriesFeedStages[stageName]] = count;
                    });

                    hirespace.View.updateView(this, 'nav.enquiries-feed');
                });
        }

        initView() {
            this.updateStageCounts();

            let callback: Function = (): void => {
                Rx.Observable.from(this.remainingStages)
                    .map(stage => this.renderView(stage));
            };

            this.renderView(this.initStage, false, callback);
        }
    }
}