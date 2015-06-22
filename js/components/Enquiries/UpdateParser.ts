module hirespace {
    'use strict';

    export class UpdateParser {
        // @TODO
        // tidy this up
        static getObject(attr: string) {
            let obj = {};

            _.forEach(attr.split(','), objectDef => {
                let split = _.map(objectDef.split(':'), part => _.trim(part, ' \' '));

                let key = _.first(split),
                    value = _.last(split);

                obj[key] = value == 'true' || value == 'false' ? (value == 'true') : value;
            });

            return obj;
        }


    }
}