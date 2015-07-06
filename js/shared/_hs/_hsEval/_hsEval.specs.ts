module hirespace.specs {
    'use strict';

    let fakeResolveObject = {};
    let fakeScope = '';

    let dynamicAttrs = ['hs-bind', 'hs-class', 'hs-repeat', 'hs-show', 'hs-hide', 'hs-click'];
    let staticAttrs = ['hs-toggle', 'hs-modal', 'hs-tabs', 'hs-ctr'];

    describe('_hsEval model', () => {
        let model: _hsEval = new _hsEval(fakeResolveObject, fakeScope);

        //beforeEach(() => {
        //
        //});

        it('should construct the _hsEval class', () => {
            expect(model).toBeDefined();
        });

        it('should contain an object of all hs-* attributes', () => {
            expect(model.attributes.dynamic).toEqual(dynamicAttrs);
            expect(model.attributes.static).toEqual(staticAttrs);
        });

        it('should set the correct DOM crawlSelector on all dynamic attributes', () => {
            expect(hirespace._hsEval.setSelector('.container', 'hs-bind')).toEqual('.container .hs-bind');
            expect(hirespace._hsEval.setSelector('.container, .box', 'hs-bind')).toEqual('.container .hs-bind, .box .hs-bind');
        });

        it('should set the correct class onto a DOM element', () => {
            $('body').append('<div id="test"></div>');
            let elem = $('#test');
            let attr = 'hs-bind';

            hirespace._hsEval.setClass(elem, attr);

            expect(elem.attr('class')).toEqual(attr + ' hs-isolate-scope');
        });
    });
}