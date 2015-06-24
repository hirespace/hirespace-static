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

            _.forEach(this.objectAlias[this.attrData.objectAlias], resolveObject => {
                console.log(resolveObject);
            })
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