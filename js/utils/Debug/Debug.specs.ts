module hirespace.specs {
    'use strict';

    describe('Debug', () => {
        it('should get the current url', () => {
            let url = hirespace.Debug.getControllerIdentifier();

            // @TODO
            // possibly change to something more generic, although this is basically testing almost
            // built-in functionality
            expect(url).toEqual('context.html');
        });

        it('should be able to get the current host (localhost:6065, ...)', () => {
            let getHost = hirespace.Debug.getHost();

            expect(getHost).toBeDefined();
        });

        it('should be able to get the current host name (localhost, ...)', () => {
            let getHostName = hirespace.Debug.getHostName();

            expect(getHostName).toBeDefined();
        });

        it('should tell that we are in test environment when running tests', () => {
            let environment = hirespace.Debug.getEnvironment();

            expect(environment).toEqual('test');
        });

        it('should be able to tell we are not in production environment when on non-production host', () => {
            let devHosts = ['server', 'localhost:6065', 'hirespace.dev', 'staging.hirespace.io', 'localhost'];

            _.forEach(devHosts, (host) => {
                let environment = hirespace.Debug.getEnvironment(host);

                expect(environment).toEqual('development');
            });
        });

        it('should be able to tell we are in production environment when on production host', () => {
            let prodHost = Config.getProductionHost(),
                environment = hirespace.Debug.getEnvironment(prodHost);

            expect(environment).toEqual('production');
        });
    });
}