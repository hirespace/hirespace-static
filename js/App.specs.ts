module hirespace.specs {
    'use strict';

    describe('App', () => {
        afterEach(() => {
            hirespace.App.subscriptions = {};
        });

        it('should have subscriptions Object, where services / controllers will get registered', () => {
            expect(typeof hirespace.App.subscriptions).toEqual('object');
        });

        it('should have subscribe method that registers functions to the subscriptions global', () => {
            expect(hirespace.App.subscribe).toBeDefined();

            let originalSubscriptionsLength = _.keys(hirespace.App.subscriptions).length;

            hirespace.App.subscribe('foo', () => {
            });
            expect(_.keys(hirespace.App.subscriptions).length).toEqual(originalSubscriptionsLength + 1);

            hirespace.App.subscribe('bar', () => {
            });
            expect(_.keys(hirespace.App.subscriptions).length).toEqual(originalSubscriptionsLength + 2);
        });
    });
}