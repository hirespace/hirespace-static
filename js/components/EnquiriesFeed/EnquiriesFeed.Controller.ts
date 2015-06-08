module hirespace {
    'use strict';

    declare
    var initEnquiriesFeedData: IEnquiriesFeedData;

    enum Stage {'New' = 1, 'In Progress', 'Needs Archiving', 'Archived'}
    enum Status {'Confirmed' = 1, 'Closed'}

    export interface IEnquiriesFeedData extends KnockoutMapping {
        _id: string;
        budget: number;
        customer: {
            company: string;
            email: string;
            mobile: string;
            name: string;
            phone: string;
        };
        date: {
            finishdate?: string;
            flexible: boolean;
            startdate: string;
        };
        message: string;
        people: number;
        stage: () => number;
        time: {
            finishtime?: string;
            flexible: boolean;
            starttime: string;
        }
        venue: {
            manager: string;
            name: string;
            team: string;
        };
        word: string;
    }

    export class EnquiriesFeedController {
        private pollingFrequency: number = 60000;

        enquiriesFeedData: IEnquiriesFeedData;
        cacheLastRes: IEnquiriesFeedData;

        constructor() {
            hirespace.Modal.listen();

            this.initEnquiriesFeedData();

            setInterval(() => {
                this.enquiriesFeedDataPromise().then((response: IEnquiriesFeedData) => {
                    if (_.isEqual(response, this.cacheLastRes)) {
                        hirespace.Logger.debug('View update skipped');

                        return false;
                    }

                    ko.mapping.fromJS(response, this.enquiriesFeedData);
                    this.cacheLastRes = response;
                });
            }, this.pollingFrequency);
        }

        enquiriesFeedDataPromise(): JQueryPromise<any> {
            return $.ajax('/enquiriesFeed/getData', {type: 'get'});
        }

        initEnquiriesFeedData() {
            // Referenced by a global variable
            this.enquiriesFeedData = ko.mapping.fromJS(initEnquiriesFeedData);
            this.cacheLastRes = initEnquiriesFeedData;

            //this.enquiriesFeedDataPromise().then((response: IEnquiriesFeedData) => {
            //    console.log('success:');
            //    console.log(response);
            //    ko.mapping.fromJS(response, this.enquiriesFeedData);
            //    this.cacheLastRes = response;
            //}, (fail) => {
            //    console.log('fail:');
            //    console.log(fail);
            //
            //});
        }

        updateStagePromise(): JQueryPromise<any> {
            return $.ajax('/enquiriesFeed/updateStage', {type: 'put', data: 'next'});
        }

        currentStage(): string {
            let stageId = this.enquiriesFeedData.stage();

            return Stage[stageId];
        }

        toStage(operator: string | number) {
            switch (operator) {
                case 'next':
                    this.updateStagePromise().then((response: number) => {
                        this.enquiriesFeedData.stage = () => response;
                        this.cacheLastRes.stage = () => response;
                    }, (fail) => {
                        console.log(fail);
                    });
            }
        }
    }

    hirespace.App.subscribe('EnquiriesFeedController', EnquiriesFeedController, true);
}