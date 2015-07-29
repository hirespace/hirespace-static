module hirespace {
    'use strict';

    export class HsRepeat {
        objectAlias = {};
        attrData: {
            objectAlias: string;
            resolveObject: string;
        };

        constructor(attr: string, resolveObject: Array<{}>) {
            this.parseAttr(attr);
            this.objectAlias[this.attrData.objectAlias] = resolveObject;
        }

        updateView(elem: JQuery) {
            // To target specific parent
            // @TODO refactor and abstract into magic vars
            let scopeId = Math.random().toString(36).substring(7);
            let scopeClass = '.' + elem.parent().addClass(scopeId).attr('class').split(' ').join('.') + ' .' + elem.attr('class');

            console.log(elem);

            let iteratee = _.first(hirespace.HsRepeat.getIteratee(elem));
            let iterateeHTML = iteratee.outerHTML;

            console.info(iterateeHTML);

            elem.html('');

            _.forEach(this.objectAlias[this.attrData.objectAlias], (data, key) => {
                elem.append(iterateeHTML);

                let currentElem = $(_.last(elem.children()));
                currentElem.attr('hs-repeat-index', key);

                console.log(currentElem);
                console.log(currentElem.attr('hs-repeat-index'));

                let resolveObject = {};
                resolveObject[this.attrData.objectAlias] = data;

                let hsBind = currentElem.find('[hs-bind]');

                if (!_.isUndefined(currentElem.attr('hs-bind'))) {
                    _.forEach(currentElem, element => hirespace.HsBind.updateElem(element, resolveObject));
                } else {
                    _.forEach(hsBind, element => hirespace.HsBind.updateElem(element, resolveObject));
                }

                let hsHrefElem = currentElem.find('[hs-href]');

                if (hsHrefElem.length > 0) hirespace.HsHref.resolve(hsHrefElem, resolveObject);

                hirespace.View.updateView(resolveObject, scopeClass + ' [hs-repeat-index=' + key + ']', true);
            });
        }

        parseAttr(attr: string) {
            let sides = _.map(attr.split(' in '), side => _.trim(side));

            this.attrData = {
                objectAlias: _.first(sides),
                resolveObject: _.last(sides)
            };
        }

        static getIteratee(elem: JQuery): JQuery {
            return $(_.first(elem.children()));
        }
    }
}