module hirespace.specs {
    'use strict';

    describe('Toggle Class', () => {
        let scenarios = [
            {
                attr: "is-hidden : bookingData.stage == 'In Progress'",
                rules: [{
                    classes: ['is-hidden'],
                    assertions: "bookingData.stage == 'In Progress'"
                }]
            },
            {
                attr: "is-visible : bookingData.stage == 'New'",
                rules: [{
                    classes: ['is-visible'],
                    assertions: "bookingData.stage == 'New'"
                }]
            },
            {
                attr: "active : bookingData._id",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id"
                }]
            },
            {
                attr: "is-visible : bookingData.stage == 'New', active : bookingData._id",
                rules: [{
                    classes: ['is-visible'],
                    assertions: "bookingData.stage == 'New'"
                }, {
                    classes: ['active'],
                    assertions: "bookingData._id"
                }]
            },
            {
                attr: "active + shake : bookingData._id",
                rules: [{
                    classes: ['active', 'shake'],
                    assertions: "bookingData._id"
                }]
            },
            {
                attr: "shake : bookingData._id || bookingData.stage == 'In Progress'",
                rules: [{
                    classes: ['shake'],
                    assertions: "bookingData._id || bookingData.stage == 'In Progress'"
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' || bookingData.venue",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id || bookingData.stage == 'In Progress' || bookingData.venue"
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' && bookingData.venue",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id || bookingData.stage == 'In Progress' && bookingData.venue"
                }]
            },
            {
                attr: "active : bookingData._id && bookingData.stage == 'Archived'",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id && bookingData.stage == 'Archived'"
                }]
            },
            {
                attr: "shake : bookingData._id && bookingData.stage == 'Archived' && bookingData.venue",
                rules: [{
                    classes: ['shake'],
                    assertions: "bookingData._id && bookingData.stage == 'Archived' && bookingData.venue"
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' , shake + active: bookingData.venue",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id || bookingData.stage == 'In Progress'"
                }, {
                    classes: ['shake', 'active'],
                    assertions: "bookingData.venue"
                }]
            },
        ];

        _.forEach(scenarios, (scenario) => {
            let model: hirespace.ToggleClass;

            beforeEach(() => {
                model = new hirespace.ToggleClass(scenario.attr);
            });

            it('should determine the correct number of rules in ' + scenario.attr, () => {
                expect(model.rules.length).toEqual(scenario.rules.length);
            });

            //it('should determine the correct number of classes per rule in ' + scenario.attr, () => {
            //    expect(model.rules).toEqual(scenario.rules);
            //});


        });
    });
}