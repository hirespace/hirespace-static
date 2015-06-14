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
                testSentence: "in-progress: bookingData.stage == 'In Progress'",
                toClass: 'in-progress',
                action: 'in-progress',
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
            },
            {
                testSentence: "new:bookingData.venue.name='non-existent'",
                toClass: undefined,
                action: 'new',
                assertion: {
                    object: "bookingData.venue.name='non-existent'",
                    sentence: "bookingData.venue.name='non-existent'",
                    type: 'boolean',
                    value: true
                }
            }
        ]
    };

    describe('View => data-toggle-view', () => {
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

    describe('View model', () => {
        let scenarios = [
            {
                attr: "active: bookingData._id",
                expectedClasses: 'active'
            },
            {
                attr: "active: bookingData._id == 'a2'",
                expectedClasses: undefined
            },
            {
                attr: "active + show + another-one: bookingData.venue",
                expectedClasses: 'active show another-one'
            },
            {
                attr: "active: bookingData.venue.manager",
                expectedClasses: undefined
            },
            {
                attr: "active: bookingData.venue.manager == 'Test'",
                expectedClasses: undefined
            },
            {
                attr: "active: bookingData.venue.manager || bookingData.venue",
                expectedClasses: 'active'
            },
            {
                attr: "active: bookingData.venue.manager && bookingData.venue",
                expectedClasses: undefined
            },
            {
                attr: "active: bookingData.venue.manager || bookingData.venue && bookingData._id",
                expectedClasses: 'active'
            },
            {
                attr: "active: bookingData.venue.manager || bookingData.venue && bookingData._id || bookingData.fakeKey",
                expectedClasses: 'active'
            },
            {
                attr: "active: bookingData.venue.manager || bookingData.venue && bookingData._id && bookingData.fakeKey",
                expectedClasses: undefined
            },
            {
                attr: "active + show : bookingData._id || bookingData.venue.manager, is-hidden: bookingData.venue == 'The Barbican'",
                expectedClasses: 'active show'
            },
            {
                attr: "show: bookingData._id == 'a2' || bookingData.venue.name, is-venue: bookingData.venue == 'The Barbican'",
                expectedClasses: 'show'
            },
            {
                attr: "show: bookingData._id == 'a2' || bookingData.venue.name, is-venue: bookingData.venue",
                expectedClasses: 'show is-venue'
            }
        ];

        _.forEach(scenarios, (scenario) => {
            let elem: Element = document.createElement('div');
            elem.setAttribute('toggle-class', scenario.attr);

            let model = new hirespace.View();

            beforeEach(() => {
                model.target = {
                    bookingData: {
                        _id: 'a1',
                        venue: {
                            name: 'The Barbican'
                        }
                    }
                };

                model.updateElem(elem);
            });

            it('should apply the correct classes on an element, given toggle-class attr is ' + scenario.attr, () => {
                expect($(elem).attr('class')).toEqual(scenario.expectedClasses);
            });
        });


    });
}