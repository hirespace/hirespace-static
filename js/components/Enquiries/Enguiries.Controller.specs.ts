// Making initEnquiriesFeedData global.
// Temp hack to suppress an error thrown by not having this variable nowhere in the sourcecode.
let initBookingData = {
    "_id": "56M4S8tNrujZCsvkY",
    "budget": 15000,
    "customer": {
        "_id": "PQAfLzSLrxW8CApGF",
        "name": "Louis Lundy",
        "mobile": "447540226270",
        "email": "llundy@adjuvo.com",
        "phone": "02070709000"
    },
    "date": {
        "finishdate": "2015-06-16T10:00:00.000Z",
        "flexible": null,
        "startdate": "2015-06-16T10:00:00.000Z"
    },
    "message": "private investor events. multiple events\nlate may early June \nunique \nhead of industry\ncentral, west end\nwine celler \n",
    "people": 70,
    "stage": {
        "name": "New"
    },
    "status": "pending",
    "time": {
        "finishtime": null,
        "flexible": null,
        "starttime": null
    },
    "timeToFollowUp": "2015-05-23T14:31:20.000Z",
    "venue": {
        "manager": "Jess ",
        "name": "Royal Over-Seas League - ROSL",
        "spaceName": "Allen"
    },
    "word": "Networking event"
};

module hirespace.specs {
    'use strict';

    describe('EnquiriesFeed Controller', () => {
        let controller: hirespace.EnquiriesController;

        beforeEach(() => {
            controller = new hirespace.EnquiriesController();

            spyOn($, 'ajax').and.callFake((url, options): any => {
                let d = $.Deferred();

                switch (options.method) {
                    case 'GET':
                        d.resolve(initBookingData);
                        break;
                    case 'PUT':
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

        it('should populate the uiConfig Object containing settings for the status bar, sections, etc', () => {
            controller.initUiConfig();

            let uiConfig = controller.uiConfig;

            expect(uiConfig.defaultStage).toEqual('New');
            expect(uiConfig.prevStage).toEqual('New');
        });

        it('should return bookingDataPromise', () => {
            let bookingDataPromise = controller.bookingDataPromise();

            bookingDataPromise.then((data) => {
                expect(data).toEqual(initBookingData);
            });
        });

        it('should return updateBookingDataPromise', () => {
            let updateBookingDataPromise = controller.updateBookingDataPromise({});

            updateBookingDataPromise.then((data) => {
                expect(data).toEqual({});
            });
        });

        it('it should have a method updating the progressBar UI', () => {
            let updateProgressBarDefault = controller.updateProgressBar();
            let updateProgressBar = controller.updateProgressBar('In Progress');

            controller.bookingData.stage.name = 'Needs Archiving';
            let updateProgressBarOutside = controller.updateProgressBar();

            expect(updateProgressBarDefault).toEqual('new');
            expect(updateProgressBar).toEqual('in-progress');
            expect(updateProgressBarOutside).toEqual('needs-archiving');
        });

        it('should update the bookingData when update has been triggered', () => {
            let newBookingData: IBookingData = initBookingData;
            newBookingData.stage.name = 'In Progress';

            controller.updateBookingData(newBookingData);

            expect(controller.bookingData.stage.name).toEqual('In Progress');
        });

        it('should have updateUi method attached to its scope', () => {
            expect(controller.updateUi).toBeDefined();
        });

        it('should successfully parse booking data', () => {
            let bookingData = controller.bookingData;

            expect(bookingData.customer.firstName).toEqual('Louis');
            expect(bookingData.customer.company).toEqual('No Company Name');
        });
    });
}