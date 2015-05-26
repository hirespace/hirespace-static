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

        it('should contain name model with default value "Hello World" in its scope', () => {
            let name = controller.name;

            expect(name).toEqual('Hello World');
        });
    });
}