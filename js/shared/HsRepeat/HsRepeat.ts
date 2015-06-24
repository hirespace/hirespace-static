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

            //hsBind = $((scope ? scope + ' ' : '') + '[hs-bind]');
            //_.forEach(hsBind, elem => hirespace.HsBind.updateElem(elem, target));
        }

        updateView(elem: JQuery) {
            let iteratee = hirespace.HsRepeat.getIteratee(elem);

            elem.html('');

            let resolveObject = {};

            _.forEach(this.objectAlias[this.attrData.objectAlias], (data, key) => {
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