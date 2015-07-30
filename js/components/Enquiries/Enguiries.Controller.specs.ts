module hirespace.specs {
    'use strict';

    declare var initBookingData: IBookingData;

    let stageResponse = {
        "enquiries": [{
            "_id": "pADzj3B3tTjHrhCjj",
            "customerName": "Hannah Thompson",
            "venueName": "Will's Studio",
            "eventdate": "2016-07-16T00:00:00.000Z",
            "budget": 1200,
            "word": "Wedding Reception",
            "status": "pending"
        }, {
            "_id": "wzeh5vGhhXbtzqK2z",
            "customerName": "Hannah Thompson",
            "venueName": "Will's Studio",
            "eventdate": "2016-07-16T00:00:00.000Z",
            "budget": 1200,
            "word": "Wedding Reception",
            "status": "pending"
        }, {
            "_id": "hRuGiNZkm98aMXRJD",
            "customerName": "Helena Charlesworth",
            "venueName": "Will's Studio",
            "eventdate": "2015-10-13T09:00:00.000Z",
            "budget": 3000,
            "word": "Workshop Space",
            "status": "pending"
        }, {
            "_id": "sx5Eff7tHvM5mdCdr",
            "customerName": "Adelle hannan",
            "venueName": "Gastrocircus",
            "eventdate": "2015-09-12T23:00:00.000Z",
            "budget": 500,
            "word": "30th Birthday Party",
            "status": "pending"
        }, {
            "_id": "NxXiiZiLuJhfbYBRv",
            "customerName": "Jake O'Neill",
            "venueName": "Gastrocircus",
            "eventdate": "2015-06-23T09:00:00.000Z",
            "budget": 1500,
            "word": "Full Day Conference",
            "status": "pending"
        }], "remaining": 12
    };
    let stagesCountResponse = {"New": 0, "In Progress": 18, "Needs Archiving": 4, "Archived": 174, "Invalid": 19};

    describe('Enquiries Controller', () => {
        let controller: hirespace.EnquiriesController;

        beforeEach(() => {
            spyOn($, 'ajax').and.callFake((opt): any => {
                let d = $.Deferred();

                switch (opt.url) {
                    case hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().getEnquiry + initBookingData._id:
                        d.resolve(initBookingData);
                        break;
                    case hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().updateEnquiry + initBookingData._id:
                        d.resolve(initBookingData);
                        break;
                    case hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().stage + 'In Progress':
                        d.resolve(stageResponse);
                        break;
                    case hirespace.Config.getApiUrl() + hirespace.Config.getApiRoutes().stages:
                        d.resolve(stagesCountResponse);
                        break;
                    default:
                        d.resolve('sendEmailPromise response');
                        break;
                }

                return d.promise();
            });

            controller = new hirespace.EnquiriesController();
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        it('should populate bookingData', () => {
            expect(controller.bookingData).toEqual(initBookingData);
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
                expect(data).toEqual(initBookingData);
            });
        });

        it('should return sendEmailPromise', () => {
            let sendEmailPromise = controller.sendEmailPromise({});

            sendEmailPromise.then((data) => {
                expect(data).toEqual('sendEmailPromise response');
            });
        });

        it('it should have a method updating the progressBar UI', () => {
            let updateProgressBarDefault = controller.updateProgressBar();
            let updateProgressBar = controller.updateProgressBar('Needs Archiving');

            controller.bookingData.stage.name = 'Archived';
            let updateProgressBarOutside = controller.updateProgressBar();

            expect(updateProgressBarDefault).toEqual('in-progress');
            expect(updateProgressBar).toEqual('needs-archiving');
            expect(updateProgressBarOutside).toEqual('archived');

            // Reset back to the original init stage
            controller.bookingData.stage.name = 'In Progress';
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

        // @TODO
        // a way to test the Date conversion?? => this will turn into filters on hs-bind
        it('should successfully parse booking data', () => {
            let bookingData = controller.bookingData;

            expect(bookingData.customer.firstName).toEqual('Valerie');
            expect(bookingData.customer.company).toBeUndefined();
        });
    });
}