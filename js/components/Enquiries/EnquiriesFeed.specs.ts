module hirespace.specs {
    'use strict';

    describe('EnquiriesFeed module', () => {
        let controller: hirespace.EnquiriesFeed;
        //let fakeStages = ['New', 'Archived', 'Other'];

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

            controller = new hirespace.EnquiriesFeed('New', '2WscqXhWtbhwxTWhs');
        });

        it('should correctly assign data', () => {
            expect(controller.initStage).toEqual('New');
            expect(controller.remainingStages).toEqual(['In Progress', 'Needs Archiving', 'Archived']);
            expect(controller.feedData._id).toEqual('2WscqXhWtbhwxTWhs');
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

        it('should have the renderTemplate method attached', () => {
            expect(controller.renderTemplate).toBeDefined();
        });

        it('should have the renderView method attached', () => {
            expect(controller.renderView).toBeDefined();
        });

        it('should have the initView method attached', () => {
            expect(controller.initView).toBeDefined();
        });


    });
}