module hirespace.specs {
    'use strict';

    describe('HsBind model', () => {
        let fakeResolveObject = {
            fakeData: true
        };

        // @TODO
        // add select behaviour
        let elementTagNames = {
            div: true,
            input: false,
            span: true,
            strong: true
        };

        _.forEach(elementTagNames, (pair, tag) =>
            $('body').append('<' + tag + ' class="elem" hs-bind="fakeData">' + (pair ? '</' + tag + '>' : '')));

        let fakeElems = $('body .elem');

        _.forEach(fakeElems, elem => {
            it('should correctly resolve the object value and render it into ' + elem.tagName + ' element', () => {
                hirespace.HsBind.updateElem(elem, fakeResolveObject);

                switch(elem.tagName.toLowerCase()) {
                    case 'input':
                        expect($(elem).val()).toEqual(fakeResolveObject.fakeData.toString());
                        break;
                    default:
                        expect($(elem).html()).toEqual(fakeResolveObject.fakeData.toString());
                        break;
                }
            });
        });
    });
}