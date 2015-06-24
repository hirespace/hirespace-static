module hirespace.specs {
    'use strict';

    describe('HsRepeat model', () => {
        let fakeBookingData = [
            {boolean: true},
            {boolean: false}
        ];

        let scenarios = [
            {
                attr: 'data in bookingData',
                childTag: 'strong',
                childClass: 'child',
                children: 2,
                expectedInnerHtml: '<strong class="child" hs-repeat-index="0"><em hs-bind="data.boolean">true</em></strong>' +
                '<strong class="child" hs-repeat-index="1"><em hs-bind="data.boolean">false</em></strong>',
                html: '<div hs-repeat="data in bookingData">' +
                '<strong class="child"><em hs-bind="data.boolean"></em></strong>' +
                '<strong></strong>' +
                '</div>',
                parsedAttr: {objectAlias: 'data', resolveObject: 'bookingData'}
            },
            {
                attr: 'alias in aliasData',
                childTag: 'span',
                childClass: 'enfant',
                children: 2,
                expectedInnerHtml: '<span class="enfant" hs-bind="alias.boolean" hs-repeat-index="0">true</span>' +
                '<span class="enfant" hs-bind="alias.boolean" hs-repeat-index="1">false</span>',
                html: '<div hs-repeat="alias in aliasData">' +
                '<span class="enfant" hs-bind="alias.boolean"></span>' +
                '</div>',
                parsedAttr: {objectAlias: 'alias', resolveObject: 'aliasData'}
            },
            {
                attr: 'fakeKey in fakeData',
                childTag: 'div',
                childClass: 'fake-class',
                children: 2,
                expectedInnerHtml: '<div class="fake-class" hs-bind="fakeKey.boolean" hs-repeat-index="0">true</div>' +
                '<div class="fake-class" hs-bind="fakeKey.boolean" hs-repeat-index="1">false</div>',
                html: '<div hs-repeat="fakeKey in fakeData">' +
                '<div class="fake-class" hs-bind="fakeKey.boolean"></div>' +
                '</div>',
                parsedAttr: {objectAlias: 'fakeKey', resolveObject: 'fakeData'}
            }
        ];

        _.forEach(scenarios, (scenario, key) => {
            let model = new hirespace.HsRepeat(scenario.attr, fakeBookingData);

            beforeEach(() => {
                $('body').append('<div id="test' + key + '">' + scenario.html + '</div>');
            });

            afterEach(() => {
                $('#test' + key).remove();
            });

            it('should correctly parse the "' + scenario.attr + '" attribute', () => {
                expect(model.attrData).toEqual(scenario.parsedAttr);
            });

            it('should correctly shadow the resolveObject with the name from ' + scenario.attr + ' attribute', () => {
                expect(model.objectAlias[scenario.parsedAttr.objectAlias]).toEqual(fakeBookingData);
            });

            it('should correctly get the first common child', () => {
                let object = $('#test' + key + ' [hs-repeat]'),
                    iteratee = hirespace.HsRepeat.getIteratee(object);

                expect(iteratee.attr('class')).toEqual(scenario.childClass);
            });

            it('should correctly update the inside html of an iteration', () => {
                let object = $('#test' + key + ' [hs-repeat]');

                model.updateView(object);

                expect(object.find(scenario.childTag).length).toEqual(fakeBookingData.length);
                expect(object.html()).toEqual(scenario.expectedInnerHtml);
            });
        });

        //it('should have the updateView method', () => {
        //    expect(model.updateView).toBeDefined();
        //});
    });
}