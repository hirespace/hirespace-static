module hirespace {
    'use strict';

    export class UpdateParser {
        static getObject(attr: string) {
            let obj = {};

            _.forEach(attr.split(','), (objectDef) => {
                let split = _.map(objectDef.split(':'), part => _.trim(part, ' \' '));

                let key = _.first(split);
                let value = _.last(split);

                obj[key] = value == 'true' || value == 'false' ? (value == 'true') : value;
            });

            return obj;
        }


    }
}