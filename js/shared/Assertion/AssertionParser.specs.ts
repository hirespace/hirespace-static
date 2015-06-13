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
                original: [[false, true]],
                expected: [true],
                overall: true
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
                expect(hirespace.AssertionParser.parse(scenario.expected)).toEqual(scenario.overall);
            });
        });

        let sentenceScenariosResolveObject = {
            bookingData: {
                _id: 'a1',
                //boolean: false,
                budget: '3,000',
                stage: 'New',
                venue: {
                    name: 'The Barbican'
                }
            }
        };

        let sentenceScenarios = [
            {
                sentence: " bookingData.stage == 'In Progress' ",
                parsed: {
                    path: 'bookingData.stage',
                    type: 'equality',
                    value: 'In Progress'
                },
                evaluation: false
            },
            {
                sentence: "bookingData.venue.name=='The Barbican'",
                parsed: {
                    path: 'bookingData.venue.name',
                    type: 'equality',
                    value: 'The Barbican'
                },
                evaluation: true
            },
            {
                sentence: "bookingData._id",
                parsed: {
                    path: 'bookingData._id',
                    type: 'boolean',
                    value: true
                },
                evaluation: true
            },
            {
                sentence: "bookingData._id=='a1'",
                parsed: {
                    path: 'bookingData._id',
                    type: 'equality',
                    value: 'a1'
                },
                evaluation: true
            },
            {
                sentence: "bookingData.budget ==  '3,000'  ",
                parsed: {
                    path: 'bookingData.budget',
                    type: 'equality',
                    value: '3,000'
                },
                evaluation: true
            },
            {
                sentence: "bookingData.venue.fakeKey",
                parsed: {
                    path: 'bookingData.venue.fakeKey',
                    type: 'boolean',
                    value: true
                },
                evaluation: false
            },
            //{
            //    sentence: "  bookingData.boolean == false  ",
            //    parsed: {
            //        path: 'bookingData.boolean',
            //        type: 'equality',
            //        value: false
            //    },
            //    evaluation: true
            //}
        ];

        _.forEach(sentenceScenarios, (scenario) => {
            it('should parse ' + scenario.sentence + ' correctly', () => {
                expect(hirespace.AssertionParser.parseSentence(scenario.sentence)).toEqual(scenario.parsed);
            });

            it('should correctly evaluate the truth-ness of ' + scenario.sentence, () => {
                expect(hirespace.AssertionParser.evaluateAssertion(scenario.sentence, sentenceScenariosResolveObject))
                    .toEqual(scenario.evaluation);
            });
        });
    });
}