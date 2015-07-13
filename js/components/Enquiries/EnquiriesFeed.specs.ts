module hirespace.specs {
    'use strict';

    declare
    var initBookingData: IBookingData;

    describe('EnquiriesFeed module', () => {
        let controller: hirespace.EnquiriesFeed;
        let pagination: {};

        beforeEach(() => {
            spyOn(Rx.Observable, 'fromPromise').and.callFake(() => {
                return Rx.Observable.empty();
            });

            spyOn(Rx.Observable, 'from').and.callFake(() => {
                return Rx.Observable.empty();
            });

            spyOn($, 'ajax').and.callFake((url, options): any => {
                let d = $.Deferred();

                switch (_.isUndefined(options.data)) {
                    case true:
                        d.resolve({});
                        break;
                    default:
                        d.resolve('with data');
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
                expect(data).toEqual({});
            });
        });

        it('should return feedDataPromise', () => {
            let feedDataPromise = controller.feedDataPromise('New', {page: 1, limit: 1});

            feedDataPromise.then((data) => {
                expect(data).toEqual('with data');
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