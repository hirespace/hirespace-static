module hirespace.specs {
    'use strict';

    describe('Toggle Class', () => {
        let scenarios = [
            {
                attr: "is-hidden : bookingData.stage == 'In Progress'",
                rules: [{
                    classes: ['is-hidden'],
                    assertions: "bookingData.stage == 'In Progress'",
                    assertionGroups: [["bookingData.stage == 'In Progress'"]]
                }]
            },
            {
                attr: "is-visible : bookingData.stage == 'New'",
                rules: [{
                    classes: ['is-visible'],
                    assertions: "bookingData.stage == 'New'",
                    assertionGroups: [["bookingData.stage == 'New'"]]
                }]
            },
            {
                attr: "active : bookingData._id",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id",
                    assertionGroups: [["bookingData._id"]]
                }]
            },
            {
                attr: "is-visible : bookingData.stage == 'New', active : bookingData._id",
                rules: [{
                    classes: ['is-visible'],
                    assertions: "bookingData.stage == 'New'",
                    assertionGroups: [["bookingData.stage == 'New'"]]
                }, {
                    classes: ['active'],
                    assertions: "bookingData._id",
                    assertionGroups: [["bookingData._id"]]
                }]
            },
            {
                attr: "active + shake : bookingData._id",
                rules: [{
                    classes: ['active', 'shake'],
                    assertions: "bookingData._id",
                    assertionGroups: [["bookingData._id"]]
                }]
            },
            {
                attr: "shake : bookingData._id || bookingData.stage == 'In Progress'",
                rules: [{
                    classes: ['shake'],
                    assertions: "bookingData._id || bookingData.stage == 'In Progress'",
                    assertionGroups: [["bookingData._id", "bookingData.stage == 'In Progress'"]]
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' || bookingData.venue",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id || bookingData.stage == 'In Progress' || bookingData.venue",
                    assertionGroups: [["bookingData._id", "bookingData.stage == 'In Progress'", "bookingData.venue"]]
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' && bookingData.venue",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id || bookingData.stage == 'In Progress' && bookingData.venue",
                    assertionGroups: [["bookingData._id", "bookingData.stage == 'In Progress'"], ["bookingData.venue"]]
                }]
            },
            {
                attr: "active : bookingData._id && bookingData.stage == 'Archived'",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id && bookingData.stage == 'Archived'",
                    assertionGroups: [["bookingData._id"], ["bookingData.stage == 'Archived'"]]
                }]
            },
            {
                attr: "shake : bookingData._id && bookingData.stage == 'Archived' && bookingData.venue",
                rules: [{
                    classes: ['shake'],
                    assertions: "bookingData._id && bookingData.stage == 'Archived' && bookingData.venue",
                    assertionGroups: [["bookingData._id"], ["bookingData.stage == 'Archived'"], ["bookingData.venue"]]
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' , shake + active: bookingData.venue",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id || bookingData.stage == 'In Progress'",
                    assertionGroups: [["bookingData._id", "bookingData.stage == 'In Progress'"]]
                }, {
                    classes: ['shake', 'active'],
                    assertions: "bookingData.venue",
                    assertionGroups: [["bookingData.venue"]]
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' && bookingData.venue || bookingData.status",
                rules: [{
                    classes: ['active'],
                    assertions: "bookingData._id || bookingData.stage == 'In Progress' && bookingData.venue || bookingData.status",
                    assertionGroups: [["bookingData._id", "bookingData.stage == 'In Progress'"], ["bookingData.venue", "bookingData.status"]]
                }]
            }
        ];

        _.forEach(scenarios, (scenario) => {
            let model: hirespace.ToggleClass;

            beforeEach(() => {
                model = new hirespace.ToggleClass(scenario.attr);
            });

            it('should determine the correct number of rules in ' + scenario.attr, () => {
                expect(model.rules.length).toEqual(scenario.rules.length);
            });

            it('should determine the correct number of classes per rule in ' + scenario.attr, () => {
                _.forEach(model.rules, (rule, key) => {
                    expect(rule.classes).toEqual(scenario.rules[key].classes);
                });
            });

            it('should determine the correct assertions per rule in ' + scenario.attr, () => {
                _.forEach(model.rules, (rule, key) => {
                    expect(rule.assertions).toEqual(scenario.rules[key].assertions);
                });
            });

            it('should correctly split and assertions into separate groups in ' + scenario.attr, () => {
                _.forEach(model.rules, (rule, key) => {
                    expect(model.parseAndAssertions(rule.assertions)).toEqual(scenario.rules[key].assertionGroups);
                });
            });

            it('should correctly evaluate whether AND or OR group is present in ' + scenario.attr, () => {
                _.forEach(model.rules, (rule, key) => {
                    console.log(rule.assertions);
                    console.log(' => ');

                    let assertionGroups = model.parseAndAssertions(rule.assertions);

                    let isMultiple = model.isMultiple(assertionGroups);
                    console.log(isMultiple);
                    //expect(model.parseAndAssertions(rule.assertions)).toEqual(scenario.rules[key].assertionGroups);
                });
            })
        });
    });
}