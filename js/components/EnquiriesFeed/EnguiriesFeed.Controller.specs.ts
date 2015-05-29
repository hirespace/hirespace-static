module hirespace.specs {
    'use strict';

    describe('EnquiriesFeed Controller', () => {
        let controller: hirespace.EnquiriesFeedController;

        beforeEach(() => {
            controller = new hirespace.EnquiriesFeedController();
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });
    });
}