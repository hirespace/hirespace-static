module hirespace.specs {
    'use strict';

    describe('Toggle Class', () => {
        let scenariosResolveObject = {
            bookingData: {
                stage: 'In Progress',
                status: 'Won',
                venue: 'The Barbican'
            }
        };

        let scenarios = [
            {
                attr: "is-hidden : bookingData.stage == 'In Progress'",
                rules: [{
                    classes: ['is-hidden'],
                    assertions: [["bookingData.stage == 'In Progress'"]],
                    evaluations: [[true]],
                    evaluation: true
                }]
            },
            {
                attr: "is-visible : bookingData.stage == 'New'",
                rules: [{
                    classes: ['is-visible'],
                    assertions: [["bookingData.stage == 'New'"]],
                    evaluations: [[false]],
                    evaluation: false
                }]
            },
            {
                attr: "active : bookingData._id",
                rules: [{
                    classes: ['active'],
                    assertions: [["bookingData._id"]],
                    evaluations: [[false]],
                    evaluation: false
                }]
            },
            {
                attr: "is-visible : bookingData.stage == 'New', active : bookingData._id",
                rules: [{
                    classes: ['is-visible'],
                    assertions: [["bookingData.stage == 'New'"]],
                    evaluations: [[false]],
                    evaluation: false
                }, {
                    classes: ['active'],
                    assertions: [["bookingData._id"]],
                    evaluations: [[false]],
                    evaluation: false
                }]
            },
            {
                attr: "active + shake : bookingData._id",
                rules: [{
                    classes: ['active', 'shake'],
                    assertions: [["bookingData._id"]],
                    evaluations: [[false]],
                    evaluation: false
                }]
            },
            {
                attr: "shake : bookingData._id || bookingData.stage == 'In Progress'",
                rules: [{
                    classes: ['shake'],
                    assertions: [["bookingData._id", "bookingData.stage == 'In Progress'"]],
                    evaluations: [[false, true]],
                    evaluation: true
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' || bookingData.venue",
                rules: [{
                    classes: ['active'],
                    assertions: [["bookingData._id", "bookingData.stage == 'In Progress'", "bookingData.venue"]],
                    evaluations: [[false, true, true]],
                    evaluation: true
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' && bookingData.venue",
                rules: [{
                    classes: ['active'],
                    assertions: [["bookingData._id", "bookingData.stage == 'In Progress'"], ["bookingData.venue"]],
                    evaluations: [[false, true], [true]],
                    evaluation: true
                }]
            },
            {
                attr: "active : bookingData._id && bookingData.stage == 'Archived'",
                rules: [{
                    classes: ['active'],
                    assertions: [["bookingData._id"], ["bookingData.stage == 'Archived'"]],
                    evaluations: [[false], [false]],
                    evaluation: false
                }]
            },
            {
                attr: "shake : bookingData._id && bookingData.stage == 'Archived' && bookingData.venue",
                rules: [{
                    classes: ['shake'],
                    assertions: [["bookingData._id"], ["bookingData.stage == 'Archived'"], ["bookingData.venue"]],
                    evaluations: [[false], [false], [true]],
                    evaluation: false
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' , shake + active: bookingData.venue",
                rules: [{
                    classes: ['active'],
                    assertions: [["bookingData._id", "bookingData.stage == 'In Progress'"]],
                    evaluations: [[false, true]],
                    evaluation: true
                }, {
                    classes: ['shake', 'active'],
                    assertions: [["bookingData.venue"]],
                    evaluations: [[true]],
                    evaluation: true
                }]
            },
            {
                attr: "active : bookingData._id || bookingData.stage == 'In Progress' && bookingData.venue || bookingData.status",
                rules: [{
                    classes: ['active'],
                    assertions: [["bookingData._id", "bookingData.stage == 'In Progress'"], ["bookingData.venue", "bookingData.status"]],
                    evaluations: [[false, true], [true, true]],
                    evaluation: true
                }]
            }
        ];

        _.forEach(scenarios, (scenario) => {
            let model: hirespace.ToggleClass;

            beforeEach(() => {
                model = new hirespace.ToggleClass(scenario.attr, scenariosResolveObject);
            });

            it('should determine the correct number of rules in ' + scenario.attr, () => {
                expect(model.rules.length).toEqual(scenario.rules.length);
            });

            it('should determine the correct number of classes per rule in ' + scenario.attr, () => {
                _.forEach(model.rules, (rule, key) => {
                    expect(rule.classes).toEqual(scenario.rules[key].classes);
                });
            });

            it('should correctly split and assertions into separate groups in ' + scenario.attr, () => {
                _.forEach(model.rules, (rule, key) => {
                    expect(rule.assertions).toEqual(scenario.rules[key].assertions);
                });
            });

            it('should correctly evaluate all assertions in ' + scenario.attr, () => {
                _.forEach(model.rules, (rule, key) => {
                    expect(model.evaluateAll(rule.assertions)).toEqual(scenario.rules[key].evaluations);
                });
            });

            it('should correctly evaluate the final assertion for each rule in ' + scenario.attr, () => {
                _.forEach(model.rules, (rule, key) => {
                    let evaluations = hirespace.AssertionParser.parseAll(scenario.rules[key].evaluations);

                    expect(hirespace.AssertionParser.parse(evaluations)).toEqual(scenario.rules[key].evaluation);
                });
            });
        });
    });
}