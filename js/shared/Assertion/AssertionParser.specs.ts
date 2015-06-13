module hirespace.specs {
    'use strict';

    describe('Assertion Parser', () => {
        let scenarios = [
            {
                original: [[true]],
                expected: [true],
                overall: true
            },
            {
                original: [[false]],
                expected: [false],
                overall: false
            },
            {
                original: [[true], [false]],
                expected: [true, false],
                overall: false
            },
            {
                original: [[false], [false]],
                expected: [false, false],
                overall: false
            },
            {
                original: [[true, false], [true]],
                expected: [true, true],
                overall: true
            },
            {
                original: [[true, false, true], [true], [true]],
                expected: [true, true, true],
                overall: true
            },
            {
                original: [[true, false, false], [false, true], [false, false, false, true]],
                expected: [true, true, true],
                overall: true
            },
            {
                original: [[true, false, false], [false, true], [false, false, false, true], [false, false]],
                expected: [true, true, true, false],
                overall: false
            },
            {
                original: [[false, false, false], [false, true], [true], [false, true]],
                expected: [false, true, true, true],
                overall: false
            }

        ];

        _.forEach(scenarios, (scenario) => {
            it('should correctly evaluate all assertion groups in ' + JSON.stringify(scenario.original), () => {
                expect(hirespace.AssertionParser.parseAll(scenario.original)).toEqual(scenario.expected);
            });

            it('should correctly evaluate the overall assertion group in ' + JSON.stringify(scenario.original), () => {
                // should check the whole rule -> so overall true only if [AndGroup1 === true AND AndGroup2 === true], etc.

                expect(hirespace.AssertionParser.parse(scenario.expected)).toEqual(scenario.overall);
            });
        });

    });
}