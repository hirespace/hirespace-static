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
        venueName: string;
        word: string;
    }

    export interface IEnquiriesFeedData {
        _id?: string;
        count: IStageCounts
        stage?: string;
    }

    export class EnquiriesFeed {
        remainingStages: Array<string>;
        feedData: IEnquiriesFeedData = {
            count: {}
        };

        constructor(public initStage: string, id: string) {
            this.initStage = initStage;
            this.remainingStages = _.without(_.keys(enquiriesFeedStages), this.initStage, 'Invalid');

            this.feedData._id = id;

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
            return '<li' + (data._id == this.feedData._id ? ' class="active"' : '') + '>' +
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
            Rx.Observable.fromPromise(this.feedDataPromise(toStage, {page: 0, limit: 5, ignore: this.feedData._id}))
                .subscribe((data: IStageData) => {
                    let target = $('nav.enquiries-feed .sub ul.' + enquiriesFeedStages[toStage]);

                    target.html('');

                    _.forEach(data.enquiries, entry => {
                        target.append(this.renderTemplate(entry));
                    });

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

                    this.feedData.stage = hirespace.SessionStorage.get('enquiriesCurrentStage');

                    hirespace.View.updateView(this, 'nav.enquiries-feed');
                });
        }

        initView() {
            this.updateStageCounts();

            let callback: Function = (): void => {
                Rx.Observable.from(this.remainingStages)
                    .map(stage => {
                        return this.renderView(stage);
                    });
            };

            this.renderView(this.initStage, false, callback);
        }
    }
}