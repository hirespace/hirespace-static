// Making initEnquiriesFeedData global.
// Temp hack to suppress an error thrown by not having this variable nowhere in the sourcecode.
let initEnquiriesFeedData = {};

module hirespace.specs {
    'use strict';

    let testData = {};

    describe('EnquiriesFeed Controller', () => {
        let controller: hirespace.EnquiriesFeedController;

        beforeEach(() => {
            controller = new hirespace.EnquiriesFeedController();

            spyOn($, 'ajax').and.callFake(() => {
                return testData;
            });
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        it('should return a http promise', () => {
            let enquiriesFeedDataPromise = controller.enquiriesFeedDataPromise();

            expect(enquiriesFeedDataPromise).toEqual(testData);
        });

        it('should get the current stage', () => {
            let currentStage = controller.currentStage();
            expect(currentStage).toEqual(1);
        });
    });
}