module hirespace.specs {
    'use strict';

    describe('Update Parser model', () => {
        let scenarios = [
            {
                attr: "customerContactedHow: 'phone'",
                expected: {
                    customerContactedHow: 'phone'
                }
            },
            {
                attr: "customerContactedHow: 'email', timeToFollowUp: '2 days'",
                expected: {
                    customerContactedHow: 'email',
                    timeToFollowUp: '2 days'
                }
            },
            {
                attr: "customerContactedHow: 'quick', boolTrue: true, boolFalse : false, stringBoolTrue: 'true'",
                expected: {
                    customerContactedHow: 'quick',
                    boolTrue: true,
                    boolFalse: false,
                    stringBoolTrue: true
                }
            }
        ];

        _.forEach(scenarios, (scenario) => {
            it('should correctly parse ' + scenario.attr, () => {
                let updateObject = hirespace.UpdateParser.getObject(scenario.attr);
                expect(updateObject).toEqual(scenario.expected);
            });
        });
    });
}