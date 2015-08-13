module hirespace {
    'use strict';

    interface IFeedData {
        page: number;
        limit: number;
        ignoreEnquiryById?: string;
    }

    interface IStageCounts {
        [stage: string]: number;
    }

    interface IStageData {
        enquiries: Array<ITemplateData>;
        remaining: number;
    }

    export interface ITemplateData {
        _id: string;
        active?: boolean;
        budget: number;
        customerName: string;
        // @TODO
        // make eventDate?
        eventdate: string;
        guid: string;
        price?: number;
        priceType?: string;
        stage: string;
        status?: string;
        venueName: string;
        word: string;
    }

    export class EnquiriesFeed {
        initStage: string;
        currentEnquiry: ITemplateData;
        enquiriesFeed: {
            [stage: string]: {
                count: number;
                enquiries: {
                    data: Array<ITemplateData>;
                    remaining?: number;
                },
                open: boolean;
                pagination: {
                    page: number;
                    limit: number;
                    ignoreEnquiryById: string;
                }
            }
        };

        constructor(private bookingData: IBookingData) {
            this.initStage = bookingData.stage.name;

            this.enquiriesFeed = {};

            this.currentEnquiry = {
                _id: bookingData._id,
                budget: bookingData.budget,
                active: true,
                customerName: bookingData.customer.name,
                eventdate: bookingData.date.startdate,
                guid: bookingData.guid,
                stage: bookingData.stage.name,
                venueName: bookingData.venue.name,
                word: bookingData.word
            };

            _.forEach(_.values(enquiriesFeedStages), (stage: string) => {
                this.enquiriesFeed[stage] = {
                    count: 0,
                    enquiries: {
                        data: []
                    },
                    open: false,
                    pagination: {
                        page: 0,
                        limit: 5,
                        ignoreEnquiryById: bookingData._id
                    }
                }
            });

            // @TODO unhack cruft and abstract
            if (bookingData.stage.name == 'Archived') {
                this.currentEnquiry.status = bookingData.status;

                if (bookingData.stage.option) {
                    this.currentEnquiry.price = bookingData.stage.option.price;
                    this.currentEnquiry.priceType = bookingData.stage.option.priceType;
                }
            }

            this.initView();

            $('nav.enquiries-feed .show-more').click((e) => {
                let stage = $(e.currentTarget).attr('stage');

                this.nRenderView(stage, false, true, false, true);
            });

            $('nav.enquiries-feed li.stage').click((e) => {
                let stage = $(e.currentTarget).attr('stage');

                this.nRenderView(stage, false, false, false, !this.enquiriesFeed[enquiriesFeedStages[stage]].open);
            });
        }

        stagesCountPromise(): JQueryPromise<any> {
            return $.ajax({
                contentType: "text/plain",
                crossDomain: true,
                data: JSON.stringify({guid: this.currentEnquiry.guid}),
                dataType: 'json',
                method: 'POST',
                url: hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().stages
            });
        }

        feedDataPromise(stage: string, data: IFeedData): JQueryPromise<any> {
            return $.ajax({
                contentType: "text/plain",
                crossDomain: true,
                data: JSON.stringify({guid: this.currentEnquiry.guid, data: data}),
                dataType: 'json',
                method: 'POST',
                url: hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().stage + stage
            });
        }

        nRenderView(toStage: string, updateCounts?: boolean, append?: boolean, newData?: any, openStage?: boolean) {
            if (updateCounts) {
                this.updateStageCounts();
            }

            if (!openStage) {
                this.enquiriesFeed[enquiriesFeedStages[toStage]].open = false;

                hirespace.View.updateView(this, 'nav.enquiries-feed');

                if (hirespace.Debug.getEnvironment() !== 'test') {
                    _.forEach(_.values(enquiriesFeedStages), stage => {
                        if (this.enquiriesFeed[stage].enquiries.data.length > 0) {
                            let target = $('nav.enquiries-feed .sub ul.' + stage),
                                HsRepeat = new hirespace.HsRepeat(target.attr('hs-repeat'), this.enquiriesFeed[stage].enquiries.data);

                            HsRepeat.updateView(target);
                        }
                    });
                }
                return false;
            } else {
                if (this.enquiriesFeed[enquiriesFeedStages[toStage]].count < 1 && toStage !== this.currentEnquiry.stage && !newData) {
                    return false;
                }

                this.enquiriesFeed[enquiriesFeedStages[toStage]].open = true;
            }

            if (newData) {
                this.currentEnquiry = {
                    _id: newData._id,
                    budget: newData.budget,
                    active: true,
                    customerName: newData.customer.name,
                    eventdate: newData.date.startdate,
                    guid: newData.guid,
                    stage: newData.stage.name,
                    venueName: newData.venue.name,
                    word: newData.word
                };

                // @TODO unhack cruft and abstract
                if (newData.stage.name == 'Archived') {
                    this.currentEnquiry.status = newData.status;

                    if (newData.stage.option) {
                        this.currentEnquiry.price = newData.stage.option.price;
                        this.currentEnquiry.priceType = newData.stage.option.priceType;
                    }
                }
            }

            if (append) {
                this.enquiriesFeed[enquiriesFeedStages[toStage]].pagination.page = this.enquiriesFeed[enquiriesFeedStages[toStage]].pagination.page + 1;
            }

            this.feedDataPromise(toStage, this.enquiriesFeed[enquiriesFeedStages[toStage]].pagination).then((data: IStageData) => {
                _.forEach(this.enquiriesFeed, (stageData, stageName) => {
                    if (stageData.enquiries.data.length > 0) {
                        if (stageName !== enquiriesFeedStages[this.currentEnquiry.stage]) {
                            this.enquiriesFeed[stageName].pagination.page = 0;

                            if (newData) {
                                this.enquiriesFeed[stageName].open = false;
                            }

                            if (_.first(stageData.enquiries.data)._id == this.currentEnquiry._id) {
                                this.enquiriesFeed[stageName].enquiries.data.shift();
                            }
                        }
                        _.forEach(stageData.enquiries.data, (enquiry: ITemplateData) => {
                            if (enquiry._id !== this.currentEnquiry._id) {
                                delete enquiry.active;
                            }
                        });
                    }
                });

                this.enquiriesFeed[enquiriesFeedStages[toStage]].enquiries.remaining = data.remaining;

                if (append) {
                    this.enquiriesFeed[enquiriesFeedStages[toStage]].enquiries.data = this.enquiriesFeed[enquiriesFeedStages[toStage]].enquiries.data.concat(data.enquiries);
                } else {
                    if (this.currentEnquiry.stage == toStage) {
                        data.enquiries.unshift(this.currentEnquiry);
                    }

                    this.enquiriesFeed[enquiriesFeedStages[toStage]].enquiries.data = data.enquiries;
                }

                hirespace.View.updateView(this, 'nav.enquiries-feed');

                if (hirespace.Debug.getEnvironment() !== 'test') {
                    _.forEach(_.values(enquiriesFeedStages), stage => {
                        if (this.enquiriesFeed[stage].enquiries.data.length > 0) {
                            let target = $('nav.enquiries-feed .sub ul.' + stage),
                                HsRepeat = new hirespace.HsRepeat(target.attr('hs-repeat'), this.enquiriesFeed[stage].enquiries.data);

                            HsRepeat.updateView(target);
                        }
                    });
                }
            });
        }

        renderView(toStage: string, updateCounts?: boolean, callback?: Function | boolean, append?: boolean, updateStage?: any) {
            this.nRenderView(toStage, updateCounts, append, updateStage);
        }

        updateStageCounts() {
            this.stagesCountPromise().then((counts: IStageCounts) => {
                _.forEach(counts, (count, stageName) => {
                    if (enquiriesFeedStages[stageName]) {
                        this.enquiriesFeed[enquiriesFeedStages[stageName]].count = count;
                    }
                });

                if (this.enquiriesFeed['new'].count > 0) {
                    $('nav.enquiries-feed li.new .label').addClass('pulsing');
                } else {
                    $('nav.enquiries-feed li.new .label').removeClass('pulsing');
                }

                hirespace.View.updateView(this, 'nav.enquiries-feed');
            });
        }

        initView() {
            this.updateStageCounts();

            this.nRenderView(this.initStage, false, false, false, true);
        }
    }
}