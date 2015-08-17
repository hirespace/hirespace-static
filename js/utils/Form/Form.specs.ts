module hirespace.Form.specs {
    'use strict';

    describe('Form.Validate.normalise() method', () => {
        let validate = [
            {input: true, output: 'true'},
            {input: 1, output: '1'},
            {input: null, output: ''},
            {input: undefined, output: ''},
            {input: NaN, output: ''},
            {input: 'string', output: 'string'}
        ];

        _.forEach(validate, assertion => {
            it('should correctly normalise ' + assertion.input, () => {
                expect(hirespace.Form.Validate.normalise(assertion.input)).toEqual(assertion.output);
            });
        });
    });

    describe('Form.Validate.required() method', () => {
        let validValues = ['s', true, 1, '0', ' '];

        _.forEach(validValues, value => {
            it('should correctly evaluate ' + value + ' to true', () => {
                expect(hirespace.Form.Validate.required(value)).toEqual(true);
            });
        });

        let invalidValues = ['', null, undefined, NaN];

        _.forEach(invalidValues, value => {
            it('should correctly evaluate ' + value + ' to false', () => {
                expect(hirespace.Form.Validate.required(value)).toEqual(false);
            });
        });
    });

    describe('Form.Validate.numeric() method', () => {
        let validValues = [1, '1', '-8', -8, '2.4', 2.4, '3,3', '6,280.200'];

        _.forEach(validValues, value => {
            it('should correctly evaluate ' + value + ' to true', () => {
                expect(hirespace.Form.Validate.numeric(value)).toEqual(true);
            });
        });

        let invalidValues = ['', 'string', 'string with 1 number'];

        _.forEach(invalidValues, value => {
            it('should correctly evaluate ' + value + ' to false', () => {
                expect(hirespace.Form.Validate.numeric(value)).toEqual(false);
            });
        });

        let onlyPositive = [1, '1', '2.4', 2.4, '3,3', '6,280.200'];
        let onlyNegative = [-1, '-1', '-2.4', -2.4, '-3,3', '-6,280.200'];

        _.forEach(onlyPositive, positive => {
            it('should correctly evaluate ' + positive + ' to true when positiveOnly flag is set', () => {
                expect(hirespace.Form.Validate.numeric(positive, 'positiveOnly')).toEqual(true);
            });
        });

        _.forEach(onlyNegative, negative => {
            it('should correctly evaluate ' + negative + ' to false when positiveOnly flag is set', () => {
                expect(hirespace.Form.Validate.numeric(negative, 'positiveOnly')).toEqual(false);
            });
        });
    });

    describe('Form.Validate.date() method', () => {
        let validDates = ['22 Aug 2015', 'August 22 2015', 'September 08 2015', 'Sep 8 2015', '8 September 2015',
            '22-08-2015', '22/08/2015', '2015-22-08', '22.Aug.2015', '22.08.2015'];

        _.forEach(validDates, date => {
            it('should evaluate ' + date + ' to true', () => {
                expect(hirespace.Form.Validate.date(date)).toEqual(true);
            });
        });

        let invalidDates = ['22 Whatever 2015', 'Something', '30 Feb 2015'];

        _.forEach(invalidDates, date => {
            it('should evaluate ' + date + ' to false', () => {
                expect(hirespace.Form.Validate.date(date)).toEqual(false);
            });
        });
    });

    describe('Form.Validate.time() method', () => {
        let validTimes = ['9:00 am', '9.00', '22.00', '24:00'];

        _.forEach(validTimes, time => {
            it('should evaluate ' + time + ' to true', () => {
                expect(hirespace.Form.Validate.time(time)).toEqual(true);
            });
        });

        let invalidTimes = ['9:61 pm', '25.00 am', 'Something'];

        _.forEach(invalidTimes, time => {
            it('should evaluate ' + time + ' to false', () => {
                expect(hirespace.Form.Validate.time(time)).toEqual(false);
            });
        });
    });

    describe('Form.Validate.tel() method', () => {
        // @TODO check why '+44 (0) 7894 846 483' evaluates to invalid
        let validTels = ['07894 846 483', '+421 904 024 789', '+4407894846483'];

        _.forEach(validTels, tel => {
            it('should evaluate ' + tel + ' to true', () => {
                expect(hirespace.Form.Validate.tel(tel)).toEqual(true);
            });
        });

        let invalidTels = ['9:61', 'anything else'];

        _.forEach(invalidTels, tel => {
            it('should evaluate ' + tel + ' to false', () => {
                expect(hirespace.Form.Validate.tel(tel)).toEqual(false);
            });
        });
    });

    describe('Form.Validate.email() method', () => {
        let validEmails = ['someone@hirespace.com'];

        _.forEach(validEmails, email => {
            it('should evaluate ' + email + ' to true', () => {
                expect(hirespace.Form.Validate.email(email)).toEqual(true);
            });
        });

        let invalidEmails = ['someone@hirespace. com', 'someone@hirespace.', 'someone@hirespacecom', 'someone@.com', 'someone@'];

        _.forEach(invalidEmails, email => {
            it('should evaluate ' + email + ' to false', () => {
                expect(hirespace.Form.Validate.email(email)).toEqual(false);
            });
        });
    });

    describe('Form.Validate.maxLength() method', () => {
        let validate = [
            {value: 'Test Value', extraParam: '2', result: false},
            {value: 'Test Value', extraParam: '128', result: true},
            {value: '', extraParam: 0, result: true},
            {value: 'Test Value', extraParam: false, result: false},
            {value: '', extraParam: null, result: false}
        ];

        _.forEach(validate, obj => {
            it('should evaluate ' + obj.value + ' to ' + obj.result, () => {
                expect(hirespace.Form.Validate.maxLength(obj.value, obj.extraParam)).toEqual(obj.result);
            });
        });
    });

    describe('Form.Validate.all() method', () => {
        let validate = [
            {value: '1.45', rules: ['required', 'numeric'], result: true, error: []},
            {value: '', rules: ['numeric', 'optional'], result: true, error: []},
            {
                value: 'hello@hirespace',
                rules: ['email', 'optional'],
                result: false,
                error: ['Must be a valid email address']
            },
            {value: '07894846843', rules: ['tel', 'optional', 'numeric'], result: true, error: []},
            {value: '07894 846 843', rules: ['tel', 'numeric'], result: false, error: ['Must be a number']},
            {value: 'String', rules: ['required', 'maxLength:8'], result: true, error: []},
            {
                value: 'This is a long string',
                rules: ['optional', 'maxLength:10'],
                result: false,
                error: ['Must be less than 10']
            },
            {value: '', rules: ['optional', 'maxLength:10'], result: true, error: []},
            {value: 'hello@hirespace.com', rules: ['email', 'optional', 'required'], result: true, error: []},
            // Optional overrides required!
            {value: '', rules: ['email', 'optional', 'required'], result: true, error: []}
        ];

        _.forEach(validate, obj => {
            it('should evaluate multiple ' + JSON.stringify(obj.rules) + ' assertions for ' + obj.value, () => {
                expect(hirespace.Form.Validate.all(obj.value, obj.rules).valid).toEqual(obj.result);
            });

            it('should respond with appropriate error messages in ' + JSON.stringify(obj.rules), () => {
                expect(hirespace.Form.Validate.all(obj.value, obj.rules).error).toEqual(obj.error);
            });
        });
    });
}