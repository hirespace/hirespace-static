// Making initEnquiriesFeedData global.
// Temp hack to suppress an error thrown by not having this variable nowhere in the sourcecode.
let initBookingData = {
    "_id": "1a",
    "budget": "3,000",
    "customer": {
        "company": "Company Ltd.",
        "email": "jamessmith@company.co.uk",
        "mobile": "+44 (0) 7894 846483",
        "name": "James Smith",
        "phone": false
    },
    "date": {
        "finishdate": "20 August 2015",
        "flexible": false,
        "startdate": "18 August 2015"
    },
    "message": "We also require overnight bedrooms, breakout rooms and WIFI. We need a registration area too including staffing, badges etc.",
    "people": 20,
    "stage": "New",
    "status": "",
    "suggestedCriteria": {},
    "time": {
        "finishtime": "11:00 pm",
        "flexible": false,
        "starttime": "10:00 am"
    },
    "venue": {
        "manager": "Paul Frank",
        "name": "The Barbican",
        "team": "The Barbican Team"
    },
    "word": "Conference",
    "internalNote": "Josh copied the details into our internal spreadsheet"
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
                    case hirespace.Config.getApiRoutes().bookings.getData:
                        d.resolve(initBookingData);
                        break;
                    case hirespace.Config.getApiRoutes().bookings.updateData:
                        d.resolve({});
                        break;
                    default:
                        d.resolve({});
                        break;
                }

                return d.promise();
            });
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        it('should populate bookingData', () => {
            expect(controller.bookingData).toEqual(initBookingData);
        });

        it('should populate bookingDataObservable', () => {
            expect(controller.bookingDataObservable).toBeDefined();
        });

        it('should return bookingDataPromise', () => {
            let bookingDataPromise = controller.bookingDataPromise();

            bookingDataPromise.then((data) => {
                expect(data).toEqual(initBookingData);
            });
        });

        it('should return updateBookingDataPromise', () => {
            let updateBookingDataPromise = controller.updateBookingDataPromise();

            updateBookingDataPromise.then((data) => {
                expect(data).toEqual({});
            });
        });
    });
}