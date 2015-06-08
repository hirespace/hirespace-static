// Making initEnquiriesFeedData global.
// Temp hack to suppress an error thrown by not having this variable nowhere in the sourcecode.
let initEnquiriesFeedData = {
    _id: '',
    budget: '',
    customer: {
        company: '',
        email: '',
        mobile: '',
        name: '',
        phone: ''
    },
    date: {
        finishdate: '',
        flexible: '',
        startdate: ''
    },
    message: '',
    people: '',
    stage: 1,
    time: {
        finishtime: '',
        flexible: '',
        starttime: ''
    },
    venue: {
        manager: '',
        name: '',
        team: ''
    },
    word: ''
};

module hirespace.specs {
    'use strict';

    describe('EnquiriesFeed Controller', () => {
        let controller: hirespace.EnquiriesFeedController;

        beforeEach(() => {
            controller = new hirespace.EnquiriesFeedController();

            spyOn($, 'ajax').and.callFake((url): any => {
                let d = $.Deferred();

                switch (url) {
                    case '/enquiriesFeed/getData':
                        d.resolve(initEnquiriesFeedData);
                        break;
                    case '/enquiriesFeed/updateStage':
                        d.resolve(2);
                        break;
                    default:
                        d.resolve(true);
                        break;
                }

                return d.promise();
            });
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        it('should return enquiriesFeedDataPromise', () => {
            let enquiriesFeedDataPromise = controller.enquiriesFeedDataPromise();

            enquiriesFeedDataPromise.then((data) => {
                expect(data).toEqual(initEnquiriesFeedData);
            });
        });

        it('should return updateStagePromise', () => {
            let updateStagePromise = controller.updateStagePromise();

            updateStagePromise.then((data) => {
                expect(data).toEqual(2);
            });
        });

        it('should get the current stage', () => {
            let currentStage = controller.currentStage();

            expect(currentStage).toEqual('New');
        });

        it('should be able to go to the next stage', () => {
            controller.toStage('next');
            console.log(controller.cacheLastRes.stage());
                //let currentStage = controller.currentStage();
            //    expect(currentStage).toEqual('In Progress');
        });
    });
}