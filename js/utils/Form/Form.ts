module hirepace.Form {
    'use strict';

    export class Validate {
        static required(value: string) {
            return _.isEmpty(value);
        }

        static number(value: string) {
            return (/^-?[\d,.]+$/).test(value);
        }

        static tel(value: string) {
            return (/^[\(\)\s\-\+\d]{10,17}$/).test(value);
        }

        static date(value: string) {
            return moment(value, ['DD MMMM YYYY', 'DD-MM-YYYY']).isValid();
        }

        static time(value: string) {
            return moment(value, ['HH:mm A', ]).isValid();
        }

        static email(value: string) {
            return (/^("([ !\x23-\x5B\x5D-\x7E]*|\\[ -~])+"|[-a-z0-9!#$%&'*+\/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+\/=?^_`{|}~]+)*)@([0-9a-z\u00C0-\u02FF\u0370-\u1EFF]([-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,61}[0-9a-z\u00C0-\u02FF\u0370-\u1EFF])?\.)+[a-z\u00C0-\u02FF\u0370-\u1EFF][-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,17}[a-z\u00C0-\u02FF\u0370-\u1EFF]$/i).test(value);
        }

        static optional(value?: string) {
            return true;
        }
    }
}