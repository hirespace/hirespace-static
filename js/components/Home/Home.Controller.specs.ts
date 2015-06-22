module hirespace.specs {
    'use strict';

    describe('HomeController', () => {
        let controller: hirespace.HomeController;

        beforeEach(() => {
            controller = new hirespace.HomeController();
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });
    });
}