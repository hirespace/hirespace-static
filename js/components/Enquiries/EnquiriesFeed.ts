module hirespace {
    'use strict';

    interface IFeedData {
        page: number;
        limit: number;
    }

    export class EnquiriesFeed {
        public feedData: {
            count: {
                [stage: string]: number;
            }
        } = {
            count: {}
        };

        constructor(private initStage: string) {
            if (hirespace.Debug.getEnvironment() !== 'test') {
                Rx.Observable.fromPromise(this.stagesCountPromise())
                    .subscribe(d => {
                        console.log(d);

                        _.forEach(d, (count: number, stageName: string) => {
                            this.feedData.count[enquiriesFeedStages[stageName]] = count;
                        });


                        hirespace.View.updateView(this, 'nav.enquiries-feed');
                    });

                let stages = _.without(_.keys(enquiriesFeedStages), initStage, 'Invalid');

                // @TODO
                // abstract page and limit to config vars
                Rx.Observable.fromPromise(this.feedDataPromise(initStage, {page: 0, limit: 5}))
                    .subscribe(d => {
                        console.log(initStage);
                        console.log(d);

                        _.forEach(stages, stage => {
                            Rx.Observable.fromPromise(this.feedDataPromise(stage, {page: 0, limit: 5}))
                                .subscribe(data => {
                                    console.log(stage);
                                    console.log(data);
                                });
                        });
                    });
            }
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
    }
}