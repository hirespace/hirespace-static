module hirespace.specs {
    'use strict';

    describe('Toggle Class', () => {
        let scenarios = [
            {attr: "is-hidden : bookingData.stage == 'In Progress'", numberOfRules: 1},
            {attr: "is-visible : bookingData.stage == 'New'", numberOfRules: 1},
            {attr: "active : bookingData._id", numberOfRules: 1},
            {attr: "is-visible : bookingData.stage == 'New', active : bookingData._id", numberOfRules: 2},
            {attr: "active + shake : bookingData._id", numberOfRules: 1},
            {attr: "shake : bookingData._id || bookingData.stage == 'In Progress'", numberOfRules: 1},
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' || bookingData.venue",
                numberOfRules: 1
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' && bookingData.venue",
                numberOfRules: 1
            },
            {attr: "active : bookingData._id && bookingData.stage == 'Archived'", numberOfRules: 1},
            {attr: "shake : bookingData._id && bookingData.stage == 'Archived' && bookingData.venue", numberOfRules: 1},
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' , shake: bookingData.venue",
                numberOfRules: 2
            },
        ];

        _.forEach(scenarios, (scenario) => {
            let model: hirespace.ToggleClass;

            beforeEach(() => {
                model = new hirespace.ToggleClass(scenario.attr);
            });

            it('should determine the correct number of rules', () => {
                expect(model.rules.length).toEqual(scenario.numberOfRules);
            });
        });
    });
}