module hirespace.specs {
    'use strict';

    describe('HsRepeat model', () => {
        let fakeBookingData = [
            {boolean: true},
            {boolean: false}
        ];

        let scenarios = [
            {
                html: '<div hs-repeat="data in bookingData"><strong id="child" hs-bind="data.boolean"></strong></div>',
                attr: 'data in bookingData',
                childId: 'child',
                parsedAttr: {objectAlias: 'data', resolveObject: 'bookingData'}
            }
        ];

        let model: hirespace.HsRepeat;

        _.forEach(scenarios, scenario => {
            beforeEach(() => {
                $('body').append('<div id="test">' + scenario.html + '</div>');

                model = new hirespace.HsRepeat(scenario.attr, fakeBookingData);
            });

            afterEach(() => {
                $('#test').remove();
            });

            it('should correctly parse the "' + scenario.attr + '" attribute', () => {
                expect(model.attrData).toEqual(scenario.parsedAttr);
            });

            it('should correctly shadow the resolveObject with the name from ' + scenario.attr + ' attribute', () => {
                expect(model.objectAlias[scenario.parsedAttr.objectAlias]).toEqual(fakeBookingData);
            });

            it('should correctly get the first common child', () => {
                let object = $('[hs-repeat]'),
                    iteratee = hirespace.HsRepeat.getIteratee(object);

                expect(iteratee.attr('id')).toEqual(scenario.childId);
            });

            it('should correctly update the inside html of an iteration', () => {
                let object = $('[hs-repeat]');

                model.updateView(object);
            });
        });

        it('should have the updateView method', () => {
            expect(model.updateView).toBeDefined();
        });
    });
}