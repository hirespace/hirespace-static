module hirepace.Form {
    'use strict';

    export class Validate {
        static normalise(value: any): string {
            return _.isUndefined(value) || _.isNull(value) || _.isNaN(value) ? '' : value.toString();
        }

        static required(value: any): boolean {
            return !_.isEmpty(Validate.normalise(value));
        }

        static numeric(value: any): boolean {
            return (/^-?[\d,.]+$/).test(Validate.normalise(value));
        }

        static tel(value: any): boolean {
            return (/^[\(\)\s\-\+\d]{10,17}$/).test(Validate.normalise(value));
        }

        static date(value: any): boolean {
            return moment(Validate.normalise(value), ['DD MMMM YYYY', 'DD-MM-YYYY']).isValid();
        }

        static time(value: any): boolean {
            return moment(Validate.normalise(value), ['HH:mm A',]).isValid();
        }

        static email(value: any): boolean {
            return (/^("([ !\x23-\x5B\x5D-\x7E]*|\\[ -~])+"|[-a-z0-9!#$%&'*+\/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+\/=?^_`{|}~]+)*)@([0-9a-z\u00C0-\u02FF\u0370-\u1EFF]([-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,61}[0-9a-z\u00C0-\u02FF\u0370-\u1EFF])?\.)+[a-z\u00C0-\u02FF\u0370-\u1EFF][-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,17}[a-z\u00C0-\u02FF\u0370-\u1EFF]$/i).test(Validate.normalise(value));
        }

        static optional(value?: any): boolean {
            return true;
        }
    }
}