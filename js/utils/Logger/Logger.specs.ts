module hirespace.specs {
    'use strict';

    let logString = 'Hello World';

    describe('Logger', () => {
        it('should have the log instance and only log into console when in development environment', () => {
            let log = hirespace.Logger.log;

            expect(log).toBeDefined();
            expect(log(logString)).toBe(false);
        });

        it('should have the info instance and only log into console when in development environment', () => {
            let info = hirespace.Logger.info;

            expect(info).toBeDefined();
            expect(info(logString)).toBe(false);
        });

        it('should have the error instance and only log into console when in development environment', () => {
            let error = hirespace.Logger.error;

            expect(error).toBeDefined();
            expect(error(logString)).toBe(false);
        });

        it('should have the debug instance and only log into console when in development environment', () => {
            let debug = hirespace.Logger.debug;

            expect(debug).toBeDefined();
            expect(debug(logString)).toBe(false);
        });
    });
}