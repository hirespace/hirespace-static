module hirespace.specs {
    'use strict';

    let fakeObject = {
        bookingData: {
            _id: '',
            budget: '3000',
            stage: 'In Progress',
            status: 'Closed',
            venue: {
                name: 'Barbican'
            }
        }
    };

    let fakeMetaData = {
        valid: [
            {
                testSentence: "show: bookingData.stage == 'In Progress'",
                action: 'show',
                assertion: {
                    object: 'bookingData.stage',
                    sentence: "bookingData.stage == 'In Progress'",
                    type: 'equality',
                    value: 'In Progress'
                }
            },
            {
                testSentence: "show: bookingData.status==Closed",
                action: 'show',
                assertion: {
                    object: 'bookingData.status',
                    sentence: "bookingData.status==Closed",
                    type: 'equality',
                    value: 'Closed'
                }
            },
            {
                testSentence: "hide:bookingData.budget ==3000",
                action: 'hide',
                assertion: {
                    object: 'bookingData.budget',
                    sentence: "bookingData.budget ==3000",
                    type: 'equality',
                    value: '3000'
                }
            },
            {
                testSentence: "show : bookingData._id",
                action: 'show',
                assertion: {
                    object: 'bookingData._id',
                    sentence: "bookingData._id",
                    type: 'boolean',
                    value: true
                }
            },
            {
                testSentence: "hide :bookingData.venue.name",
                action: 'hide',
                assertion: {
                    object: 'bookingData.venue.name',
                    sentence: "bookingData.venue.name",
                    type: 'boolean',
                    value: true
                }
            }
        ],
        //invalid: [
        //    "show: bookingData.stage = 'In Progress'",
        //    "show: bookingData.status==Closed"
        //]
    };

    describe('View module', () => {
        _.forEach(fakeMetaData.valid, (data) => {
            let sentence = data.assertion.sentence;
            let assertion = hirespace.View.parseAssertionSentence(sentence);

            it('should parse assertion sentence: ' + sentence, () => {
                expect(assertion.object).toEqual(data.assertion.object);
                expect(assertion.type).toEqual(data.assertion.type);
                expect(assertion.value).toEqual(data.assertion.value);
            });

            it('should successfully decrypt assertion meta data', () => {
                _.forEach(fakeMetaData.valid, (data) => {
                    let assertionData: IAssertionMetaData = hirespace.View.parseAssertionMetaData(data.testSentence);

                    expect(assertionData.action).toEqual(data.action);
                    expect(_.isEqual(assertionData.assertion, data.assertion)).toBe(true);
                });
            });
        });

        fit('should get the value of an existing object key', () => {
            let object = 'bookingData.stage';

            let value = hirespace.View.getValue(object, fakeObject);
            console.log(value);
        });
    });
}