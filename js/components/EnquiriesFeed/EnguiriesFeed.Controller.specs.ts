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
    });
}