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
            let scopeId = Math.random().toString(36).substring(7);
            let scopeClass = '.' + elem.parent().addClass(scopeId).attr('class').split(' ').join('.') + ' .' + elem.attr('class');

            let iteratee = hirespace.HsRepeat.getIteratee(elem);

            elem.html('');

            _.forEach(this.objectAlias[this.attrData.objectAlias], (data, key) => {
                let resolveObject = {};

                iteratee.attr('hs-repeat-index', key);
                let iterateeHtml = iteratee[0].outerHTML;

                resolveObject[this.attrData.objectAlias] = data;

                elem.append(iterateeHtml);

                let current = $(elem).find('[hs-repeat-index=' + key + ']');
                let hsBind = current.find('[hs-bind]');

                if (!_.isUndefined(current.attr('hs-bind'))) {
                    _.forEach(current, element => hirespace.HsBind.updateElem(element, resolveObject));
                } else {
                    _.forEach(hsBind, element => hirespace.HsBind.updateElem(element, resolveObject));
                }

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
            return elem.children().first();
        }
    }
}