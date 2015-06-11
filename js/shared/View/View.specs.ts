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
                toClass: 'is-visible',
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
                toClass: 'is-visible',
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
                toClass: 'is-hidden',
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
                toClass: 'is-visible',
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
                toClass: 'is-hidden',
                action: 'hide',
                assertion: {
                    object: 'bookingData.venue.name',
                    sentence: "bookingData.venue.name",
                    type: 'boolean',
                    value: true
                }
            },
        ],
        invalid: [
            {
                testSentence: "hide :bookingData.venue.name.fakeKey",
                toClass: 'is-visible',
                action: 'hide',
                assertion: {
                    object: 'bookingData.venue.name.fakeKey',
                    sentence: "bookingData.venue.name.fakeKey",
                    type: 'boolean',
                    value: true
                }
            },
            {
                testSentence: "hide:bookingData.venue.name='non-existent'",
                toClass: 'is-visible',
                action: 'hide',
                assertion: {
                    object: "bookingData.venue.name='non-existent'",
                    sentence: "bookingData.venue.name='non-existent'",
                    type: 'boolean',
                    value: true
                }
            }
        ]
    };

    describe('View module', () => {
        _.forEach(fakeMetaData.valid, (data) => {
            let sentence: string = data.assertion.sentence;
            let assertion: IAssertionSentence = hirespace.View.parseAssertionSentence(sentence);
            let fakeElem: Element;

            beforeEach(() => {
                fakeElem = document.createElement('div');
                fakeElem.setAttribute('data-toggle-view', data.testSentence);
            });

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

            it('should get the value of an existing object key extracted from a sentence', () => {
                let value = hirespace.View.resolveObject(data.assertion.object, fakeObject),
                    values = _.flatten(_.map(_.values(fakeObject.bookingData), (x) => _.isObject(x) ? _.values(x) : x));

                expect(_.contains(values, value)).toBe(true);
            });

            it('it should update element\'s visibility', () => {
                hirespace.View.updateElement(fakeElem, fakeObject);

                let newClass: string = $(fakeElem).attr('class');

                expect(newClass).toEqual(data.toClass);
            });
        });

        _.forEach(fakeMetaData.invalid, (data) => {
            let sentence: string = data.assertion.sentence;
            let assertion: IAssertionSentence = hirespace.View.parseAssertionSentence(sentence);
            let fakeElem: Element;

            beforeEach(() => {
                fakeElem = document.createElement('div');
                fakeElem.setAttribute('data-toggle-view', data.testSentence);
            });

            it('should still parse assertion sentence: ' + sentence, () => {
                expect(assertion.object).toEqual(data.assertion.object);
                expect(assertion.type).toEqual(data.assertion.type);
                expect(assertion.value).toEqual(data.assertion.value);
            });

            it('should still successfully decrypt assertion meta data', () => {
                _.forEach(fakeMetaData.valid, (data) => {
                    let assertionData: IAssertionMetaData = hirespace.View.parseAssertionMetaData(data.testSentence);

                    expect(assertionData.action).toEqual(data.action);
                    expect(_.isEqual(assertionData.assertion, data.assertion)).toBe(true);
                });
            });

            it('should still get the value of an existing object key extracted from a sentence', () => {
                let value = hirespace.View.resolveObject(data.assertion.object, fakeObject),
                    values = _.flatten(_.map(_.values(fakeObject.bookingData), (x) => _.isObject(x) ? _.values(x) : x));

                expect(_.contains(values, value)).toBe(false);
            });

            it('it should update element\'s visibility', () => {
                hirespace.View.updateElement(fakeElem, fakeObject);

                let newClass: string = $(fakeElem).attr('class');

                expect(newClass).toEqual(data.toClass);
            });
        });
    });
}