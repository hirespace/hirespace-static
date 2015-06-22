module hirespace.specs {
    'use strict';

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
            let target = {
                bookingData: {
                    _id: 'a1',
                    venue: {
                        name: 'The Barbican'
                    }
                }
            };

            let elem: Element = document.createElement('div');
            elem.setAttribute('hs-class', scenario.attr);

            beforeEach(() => {
                hirespace.View.updateElem(elem, target);
            });

            it('should apply the correct classes on an element, given hs-class attr is ' + scenario.attr, () => {
                expect($(elem).attr('class')).toEqual(scenario.expectedClasses);
            });
        });


    });
}