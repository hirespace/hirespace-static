module hirespace.specs {
    'use strict';

    describe('EnquiriesFeed module', () => {
        let controller: hirespace.EnquiriesFeed;

        beforeEach(() => {
            controller = new hirespace.EnquiriesFeed('New');

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
    });
}