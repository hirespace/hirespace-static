module hirespace.specs {
    'use strict';

    describe('HsBind model', () => {
        let fakeResolveObject = {
            boolean: true,
            zero: 0
        };

        // @TODO
        // add select behaviour
        let elementTagNames = {
            div: true,
            input: false,
            span: true,
            strong: true
        };

        _.forEach(fakeResolveObject, (value, key) => {
            _.forEach(elementTagNames, (pair, tag) =>
                $('body').append('<' + tag + ' class="' + key + '" hs-bind="' + key + '">' + (pair ? '</' + tag + '>' : '')));

            _.forEach($('body .' + key), elem => {
                it('should correctly resolve the object value and render it into ' + elem.tagName + ' element', () => {
                    hirespace.HsBind.updateElem(elem, fakeResolveObject);

                    switch (elem.tagName.toLowerCase()) {
                        case 'input':
                            expect($(elem).val()).toEqual(value.toString());
                            break;
                        default:
                            expect($(elem).html()).toEqual(value.toString());
                            break;
                    }
                });
            });
        });
    });
}