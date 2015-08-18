module hirespace.specs {
    'use strict';

    declare var initBookingData: IBookingData;

    let stageResponse: {
        enquiries: ITemplateData[];
        remaining: number;
    } = {
        enquiries: [{
            _id: "pADzj3B3tTjHrhCjj",
            active: false,
            budget: 1200,
            customerName: "Hannah Thompson",
            eventdate: "2016-07-16T00:00:00.000Z",
            guid: initBookingData.guid,
            stage: "In Progress",
            status: "pending",
            venueName: "Will's Studio",
            word: "Wedding Reception"
        }, {
            _id: "wzeh5vGhhXbtzqK2z",
            active: false,
            budget: 1200,
            customerName: "Hannah Thompson",
            eventdate: "2016-07-16T00:00:00.000Z",
            guid: initBookingData.guid,
            stage: "In Progress",
            status: "pending",
            venueName: "Will's Studio",
            word: "Wedding Reception"
        }, {
            _id: "hRuGiNZkm98aMXRJD",
            active: false,
            budget: 3000,
            customerName: "Helena Charlesworth",
            eventdate: "2015-10-13T09:00:00.000Z",
            guid: initBookingData.guid,
            stage: "In Progress",
            status: "pending",
            venueName: "Will's Studio",
            word: "Workshop Space"
        }, {
            _id: "sx5Eff7tHvM5mdCdr",
            active: false,
            budget: 500,
            customerName: "Adelle hannan",
            eventdate: "2015-09-12T23:00:00.000Z",
            guid: initBookingData.guid,
            stage: "In Progress",
            status: "pending",
            venueName: "Gastrocircus",
            word: "30th Birthday Party"
        }, {
            _id: "NxXiiZiLuJhfbYBRv",
            active: false,
            budget: 1500,
            customerName: "Jake O'Neill",
            eventdate: "2015-06-23T09:00:00.000Z",
            guid: initBookingData.guid,
            stage: "In Progress",
            status: "pending",
            venueName: "Gastrocircus",
            word: "Full Day Conference"
        }], remaining: 12
    };
    let stagesCountResponse = {"New": 0, "In Progress": 18, "Needs Archiving": 4, "Archived": 174, "Invalid": 19};

    describe('EnquiriesFeed module', () => {
        let controller: hirespace.EnquiriesFeed;
        let pagination: {};

        beforeEach(() => {
            spyOn($, 'ajax').and.callFake((opt): any => {
                let d = $.Deferred();

                switch (opt.url) {
                    case hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().stage + 'New':
                        d.resolve(stageResponse);
                        break;
                    case hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().stage + 'Archived':
                        d.resolve(stageResponse);
                        break;
                    default:
                        d.resolve(stagesCountResponse);
                        break;
                }

                return d.promise();
            });

            initBookingData.stage.name = 'New';
            controller = new hirespace.EnquiriesFeed(initBookingData);

            _.forEach(controller.enquiriesFeed, stageData => stageData.enquiries.data = stageResponse.enquiries);
        });

        it('should correctly assign data', () => {
            expect(controller.initStage).toEqual('New');
            expect(controller.currentEnquiry._id).toEqual('BBX54hYWFmofZYgAB');
        });

        it('should set the pagination correctly upon initialisation', () => {
            let pagination = controller.enquiriesFeed[enquiriesFeedStages[controller.initStage]].pagination;

            expect(pagination.page).toEqual(0);
        });

        it('should return stagesCountPromise', () => {
            let stagesCountPromise = controller.stagesCountPromise();

            stagesCountPromise.then((data) => {
                expect(data).toEqual(stagesCountResponse);
            });
        });

        it('should return feedDataPromise', () => {
            let feedDataPromise = controller.feedDataPromise('New', {page: 1, limit: 1});

            feedDataPromise.then((data) => {
                expect(data).toEqual(stageResponse);
            });
        });

        it('should have the updateStageCounts method attached', () => {
            expect(controller.updateStageCounts).toBeDefined();
        });

        it('should have the renderView method attached', () => {
            expect(controller.renderView).toBeDefined();
        });

        it('should have the initView method attached', () => {
            expect(controller.initView).toBeDefined();
        });

        it('should correctly open or close the current stage tab', () => {
            controller.nRenderView('In Progress', false, false, false, true);
            expect(controller.enquiriesFeed['in-progress'].open).toEqual(true);

            controller.nRenderView('In Progress', false, false, false, false);
            expect(controller.enquiriesFeed['in-progress'].open).toEqual(false);
        });

        it('should correctly close all but the current stage tab when newData is provided', () => {
            _.forEach(controller.enquiriesFeed, stageData => {
                stageData.open = true;
            });

            let newBookingData = initBookingData;

            newBookingData.stage.name = 'Archived';
            newBookingData.status = 'lost';

            controller.nRenderView('Archived', true, false, initBookingData, true);

            _.forEach(controller.enquiriesFeed, (stageData, stageName) => {
                if (stageName == 'archived') {
                    expect(stageData.open).toEqual(true);
                } else {
                    expect(stageData.open).toEqual(false);
                }
            });
        });

        it('should provide relevant data when toStage is Archived', () => {
            controller.enquiriesFeed['archived'].enquiries.data = stageResponse.enquiries;

            let newBookingData = initBookingData;

            newBookingData.stage.name = 'Archived';
            newBookingData.status = 'lost';
            newBookingData.stage.option = {
                price: 200,
                priceType: 'Fin',
                reasonLost: 'No Availability'
            };

            controller.nRenderView('Archived', false, false, newBookingData, true);

            expect(controller.currentEnquiry.stage).toEqual('Archived');
            expect(controller.currentEnquiry.status).toEqual('lost');
            expect(controller.currentEnquiry.price).toEqual(200);
            expect(controller.currentEnquiry.priceType).toEqual('Fin');
        });
    });
}