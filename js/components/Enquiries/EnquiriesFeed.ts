module hirespace {
    'use strict';

    interface IFeedData {
        page: number;
        limit: number;
    }

    export class EnquiriesFeed {
        constructor() {
            if (hirespace.Debug.getEnvironment() !== 'test') {
                Rx.Observable.fromPromise(this.stagesCountPromise())
                    .subscribe(d => console.log(d));

                Rx.Observable.fromPromise(this.feedDataPromise('New', {page: 5, limit: 1}))
                    .subscribe(d => console.log(d));
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