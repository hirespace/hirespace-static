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
        current?: boolean;
        customerName: string;
        // @TODO
        // make eventDate?
        eventdate: string;
        guid: string;
        stage: string;
        venueName: string;
        word: string;
    }

    export interface IEnquiriesFeedData {
        count: IStageCounts;
        current: ITemplateData;
        enquiries: Array<ITemplateData>;
        remaining: number;
        pagination: {
            [name: string]: {
                page: number
            }
        };
    }

    export class EnquiriesFeed {
        initStage: string;
        remainingStages: Array<string>;
        feedData: IEnquiriesFeedData;

        constructor(private bookingData: IBookingData) {
            this.initStage = bookingData.stage.name;
            this.remainingStages = _.without(_.keys(enquiriesFeedStages), this.initStage, 'Invalid');

            this.feedData = {
                count: {},
                current: {
                    _id: bookingData._id,
                    budget: bookingData.budget,
                    customerName: bookingData.customer.name,
                    eventdate: bookingData.date.startdate,
                    guid: bookingData.guid,
                    stage: bookingData.stage.name,
                    venueName: bookingData.venue.name,
                    word: bookingData.word
                },
                enquiries: [],
                remaining: 0,
                pagination: {}
            };

            this.initView();

            $('nav.enquiries-feed .show-more').click((e) => {
                let stage = $(e.currentTarget).attr('stage');

                this.updatePagination(enquiriesFeedStages[stage]);
                this.renderView(stage, false, () => {}, true);
            });
        }

        stagesCountPromise(): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookingsStages, {
                method: 'GET', headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode(this.feedData.current.guid)
                }
            });
        }

        feedDataPromise(stage: string, data: IFeedData): JQueryPromise<any> {
            return $.ajax(hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookingsStages + stage, {
                data: data, method: 'GET', headers: {
                    Authorization: 'Basic ' + hirespace.Base64.encode(this.feedData.current.guid)
                }
            });
        }

        updatePagination(stage: string) {
            this.feedData.pagination[stage].page = this.feedData.pagination[stage].page + 1;
        }

        renderView(toStage: string, updateCounts?: boolean, callback?: Function, append?: boolean) {
            hirespace.Logger.debug('Feed view rendered');

            if (updateCounts) {
                this.updateStageCounts();
            }

            let feedDataPromiseData = {
                page: this.feedData.pagination[enquiriesFeedStages[toStage]].page,
                // @TODO
                // abstract into config var?
                limit: 5,
                ignore: this.feedData.current._id
            };

            // @TODO
            // abstract page and limit to config vars
            Rx.Observable.fromPromise(this.feedDataPromise(toStage, feedDataPromiseData))
                .subscribe((data: IStageData) => {
                    // Marks as the current enquiry
                    this.feedData.current.current = true;

                    if (append) {
                        this.feedData.enquiries = this.feedData.enquiries.concat(data.enquiries);
                    } else {
                        data.enquiries.unshift(this.feedData.current);

                        this.feedData.enquiries = data.enquiries;
                    }

                    this.feedData.current.stage = toStage;
                    this.feedData.remaining = data.remaining;

                    hirespace.View.updateView(this, 'nav.enquiries-feed');

                    let target = $('nav.enquiries-feed .sub ul.' + enquiriesFeedStages[toStage]);

                    // @TODO
                    // this will work without calling it from outside an randomly, perhaps it should work as part of
                    // View.updateView()
                    let HsRepeat = new hirespace.HsRepeat(target.attr('hs-repeat'), this.feedData.enquiries);
                    HsRepeat.updateView(target);

                    if (_.isFunction(callback)) {
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
            _.forEach(_.values(enquiriesFeedStages), (stage: string) => this.feedData.pagination[stage] = {page: 0});

            this.updateStageCounts();

            let callback: Function = (): void => {
                Rx.Observable.from(this.remainingStages)
                    .map(stage => this.renderView(stage));
            };

            this.renderView(this.initStage, false, callback);
        }
    }
}