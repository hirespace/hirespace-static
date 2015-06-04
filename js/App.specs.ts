module hirespace.specs {
    'use strict';

    describe('App', () => {
        afterEach(() => {
            hirespace.App.subscriptions = {};
            hirespace.App.knockout = {};
        });

        it('should have subscriptions Object, where services / controllers will get registered', () => {
            expect(typeof hirespace.App.subscriptions).toEqual('object');
        });

        it('should have knockout Array, where knockout models will get registered', () => {
            expect(typeof hirespace.App.knockout).toEqual('object');
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

        it('should have subscribe method that registers functions to the knockout global', () => {
            let originalKnockoutLength = _.keys(hirespace.App.knockout).length;

            hirespace.App.subscribe('foobar', () => {}, true);

            expect(_.keys(hirespace.App.knockout).length).toEqual(originalKnockoutLength + 1);
        });
    });
}