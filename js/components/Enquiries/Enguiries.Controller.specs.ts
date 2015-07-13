module hirespace.specs {
    'use strict';

    declare
    var initBookingData: IBookingData;

    describe('Enquiries Controller', () => {
        let controller: hirespace.EnquiriesController;

        beforeEach(() => {
            spyOn(Rx.Observable, 'fromPromise').and.callFake(() => {
                return Rx.Observable.empty();
            });

            spyOn(Rx.Observable, 'from').and.callFake(() => {
                return Rx.Observable.empty();
            });

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

            controller = new hirespace.EnquiriesController();
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

        it('should return sendEmailPromise', () => {
            let sendEmailPromise = controller.sendEmailPromise({});

            sendEmailPromise.then((data) => {
                expect(data).toEqual({});
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
            expect(bookingData.customer.company).toEqual('No Company Name');
        });
    });
}