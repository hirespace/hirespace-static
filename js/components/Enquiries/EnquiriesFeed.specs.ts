module hirespace.specs {
    'use strict';

    declare var initBookingData: IBookingData;

    let stageResponse = {
        "enquiries": [{
            "_id": "pADzj3B3tTjHrhCjj",
            "customerName": "Hannah Thompson",
            "venueName": "Will's Studio",
            "eventdate": "2016-07-16T00:00:00.000Z",
            "budget": 1200,
            "word": "Wedding Reception",
            "status": "pending"
        }, {
            "_id": "wzeh5vGhhXbtzqK2z",
            "customerName": "Hannah Thompson",
            "venueName": "Will's Studio",
            "eventdate": "2016-07-16T00:00:00.000Z",
            "budget": 1200,
            "word": "Wedding Reception",
            "status": "pending"
        }, {
            "_id": "hRuGiNZkm98aMXRJD",
            "customerName": "Helena Charlesworth",
            "venueName": "Will's Studio",
            "eventdate": "2015-10-13T09:00:00.000Z",
            "budget": 3000,
            "word": "Workshop Space",
            "status": "pending"
        }, {
            "_id": "sx5Eff7tHvM5mdCdr",
            "customerName": "Adelle hannan",
            "venueName": "Gastrocircus",
            "eventdate": "2015-09-12T23:00:00.000Z",
            "budget": 500,
            "word": "30th Birthday Party",
            "status": "pending"
        }, {
            "_id": "NxXiiZiLuJhfbYBRv",
            "customerName": "Jake O'Neill",
            "venueName": "Gastrocircus",
            "eventdate": "2015-06-23T09:00:00.000Z",
            "budget": 1500,
            "word": "Full Day Conference",
            "status": "pending"
        }], "remaining": 12
    };
    let stagesCountResponse = {"New": 0, "In Progress": 18, "Needs Archiving": 4, "Archived": 174, "Invalid": 19};

    describe('EnquiriesFeed module', () => {
        let controller: hirespace.EnquiriesFeed;
        let pagination: {};

        beforeEach(() => {
            spyOn($, 'ajax').and.callFake((url): any => {
                let d = $.Deferred();

                switch (url) {
                    case hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().bookingsStages + 'New':
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
        });

        it('should correctly assign data', () => {
            expect(controller.initStage).toEqual('New');
            expect(controller.remainingStages).toEqual(['In Progress', 'Needs Archiving', 'Archived']);
            expect(controller.feedData.current._id).toEqual('BBX54hYWFmofZYgAB');
        });

        it('should set the pagination correctly upon initialisation', () => {
            let pagination = controller.feedData.pagination[enquiriesFeedStages[controller.initStage]];

            expect(pagination.page).toEqual(0);
        });

        it('should successfully bump up the page for a specific stage', () => {
            controller.updatePagination('new');
            expect(controller.feedData.pagination['new'].page).toEqual(1);
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


    });
}