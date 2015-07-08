module hirespace {
    'use strict';

    export class HsHref {
        static resolve(element: JQuery, resolveObject: any) {
            // @TODO
            // abstract the brackets into a config var
            let href = element.attr('hs-href').replace(/\{=.*?\}/g, (match: string) =>
                hirespace.AssertionParser.resolveObject(_.trim(match, '{= }'), resolveObject));

            element.attr('href', href);
        }
    }
}