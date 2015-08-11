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
        let validValues = [1, '1', '-8', '2.4', '3,3', '6,280.200'];

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

    describe('Form.Validate.all() method', () => {
        let validate = [
            {value: '1.45', rules: ['required', 'numeric'], result: true},
            {value: '', rules: ['numeric', 'optional'], result: true},
            {value: 'hello@hirespace', rules: ['email', 'optional'], result: false},
            {value: '07894846843', rules: ['tel', 'optional', 'numeric'], result: true},
            {value: '07894 846 843', rules: ['tel', 'numeric'], result: false},
            {value: 'hello@hirespace.com', rules: ['email', 'optional', 'required'], result: true},
            // Optional overrides required!
            {value: '', rules: ['email', 'optional', 'required'], result: true}
        ];

        _.forEach(validate, obj => {
            it('should evaluate multiple ' + JSON.stringify(obj.rules) + ' assertions for ' + obj.value, () => {
                expect(hirespace.Form.Validate.all(obj.value, obj.rules)).toEqual(obj.result);
            });
        });
    });
}