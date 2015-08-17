module hirespace.Form {
    'use strict';

    interface IValid {
        [rule: string]: boolean;
    }

    interface IValidateAllResponse {
        valid: boolean;
        error: string[];
    }

    let errorMessages = {
        required: 'This information is required',
        numeric: 'Must be a number',
        tel: 'Must be a valid telephone number',
        date: 'Must be a valid date',
        time: 'Must be a valid time',
        email: 'Must be a valid email address',
        maxLength: 'Must be less than '
    };

    export class Validate {
        // @TODO refactor cruft
        static all(value: any, rules: string[]): IValidateAllResponse {
            let valid: IValid = {},
                normalisedValue: string = Validate.normalise(value),
                splitRule: string[],
                extraParam: string | boolean,
                response = {
                    valid: false,
                    error: []
                };

            _.forEach(rules, rule => {
                splitRule = rule.split(':');
                extraParam = (splitRule.length > 1) ? _.last(splitRule) : false;

                if (extraParam && Validate[_.first(splitRule)]) {
                    valid[_.first(splitRule)] = Validate[_.first(splitRule)](normalisedValue, extraParam);
                    if (valid[_.first(splitRule)] === false) {
                        response.error.push(errorMessages[_.first(splitRule)] + _.last(splitRule));
                    }
                } else {
                    if (Validate[rule]) {
                        valid[rule] = Validate[rule](normalisedValue);
                        if (valid[rule] === false) {
                            response.error.push(errorMessages[rule]);
                        }
                    }
                }
            });

            response.valid = _.isEmpty(normalisedValue) && valid['optional'] ? true : !_.contains(_.values(valid), false);
            response.error = _.isEmpty(normalisedValue) && valid['optional'] ? [] : response.error;

            return response;
        }

        static normalise(value: any): string {
            return (typeof value == 'string')
                ? value : (_.isUndefined(value) || _.isNull(value) || _.isNaN(value))
                ? '' : value.toString();
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
            return (/^("([ !\x23-\x5B\x5D-\x7E]*|\\[ -~])+"|[-a-z0-9!#$%&'*+\/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+\/=?^_`{|}~]+)*)@([0-9a-z\u00C0-\u02FF\u0370-\u1EFF]([-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,61}[0-9a-z\u00C0-\u02FF\u0370-\u1EFF])?\.)+[a-z\u00C0-\u02FF\u0370-\u1EFF][-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,17}[a-z\u00C0-\u02FF\u0370-\u1EFF]$/i)
                .test(Validate.normalise(value));
        }

        static maxLength(value: any, extraParam: any) {
            return Validate.normalise(value).length <= _.parseInt(extraParam);
        }

        static optional(value?: any): boolean {
            return true;
        }
    }
}