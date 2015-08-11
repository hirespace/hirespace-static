module hirepace.Form.specs {
    'use strict';

    describe('Form.Validate.required() method', () => {
        let validValues = ['s', true, 1, '0', ' '];

        _.forEach(validValues, value => {
            it('should correctly evaluate ' + value + ' to true', () => {
                expect(hirepace.Form.Validate.required(value)).toEqual(true);
            });
        });

        let invalidValues = ['', null, undefined, NaN];

        _.forEach(invalidValues, value => {
            it('should correctly evaluate ' + value + ' to false', () => {
                expect(hirepace.Form.Validate.required(value)).toEqual(false);
            });
        });
    });

    describe('Form.Validate.date() method', () => {
        let validDates = ['22 Aug 2015', 'August 22 2015', 'September 08 2015', 'Sep 8 2015', '8 September 2015',
            '22-08-2015', '22/08/2015', '2015-22-08', '22.Aug.2015', '22.08.2015'];

        _.forEach(validDates, date => {
            it('should evaluate ' + date + ' to true', () => {
                expect(hirepace.Form.Validate.date(date)).toEqual(true);
            });
        });

        let invalidDates = ['22 Whatever 2015', 'Something', '30 Feb 2015'];

        _.forEach(invalidDates, date => {
            it('should evaluate ' + date + ' to false', () => {
                expect(hirepace.Form.Validate.date(date)).toEqual(false);
            });
        });
    });

    describe('Form.Validate.time() method', () => {
        let validTimes = ['9:00 am', '9.00', '22.00', '24:00'];

        _.forEach(validTimes, time => {
            it('should evaluate ' + time + ' to true', () => {
                expect(hirepace.Form.Validate.time(time)).toEqual(true);
            });
        });

        let invalidTimes = ['9:61 pm', '25.00 am', 'Something'];

        _.forEach(invalidTimes, time => {
            it('should evaluate ' + time + ' to false', () => {
                expect(hirepace.Form.Validate.time(time)).toEqual(false);
            });
        });
    });
}