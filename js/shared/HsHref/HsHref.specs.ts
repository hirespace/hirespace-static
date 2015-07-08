module hirespace.specs {
    'use strict';

    describe('HsHref model', () => {
        $('body').append('<a hs-href="/test/{=data.href}" id="hs-href-test"></a>');

        it('should have the resolve model attached', () => {
            expect(hirespace.HsHref.resolve).toBeDefined();
        });

        it('should correctly attach the href attribute', () => {
            let elem = $('#hs-href-test');

            hirespace.HsHref.resolve(elem, {data: {href: 'url'}});

            expect(elem.attr('href')).toEqual('/test/url');
        });
    });
}