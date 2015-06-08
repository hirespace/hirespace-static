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

            spyOn($, 'ajax').and.callFake(() => {
                return initEnquiriesFeedData;
            });
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        it('should return a http promise', () => {
            let enquiriesFeedDataPromise = controller.enquiriesFeedDataPromise();

            expect(enquiriesFeedDataPromise).toEqual(initEnquiriesFeedData);
        });

        it('should get the current stage', () => {
            let currentStage = controller.currentStage();
            expect(currentStage).toEqual('New');
        });
    });
}