module hirespace.specs {
    'use strict';

    describe('Toggle Class model', () => {
        let fakeElems: Array<{id: string; cls?: string;}> = [
            {id: 'test-elem-1'},
            {id: 'test-elem-2'},
            {id: 'test-elem-3', cls: 'is-hidden'}
        ];
        let scenarios = [
            {
                toggleElem: '["test-elem-1"]',
                classes: {'test-elem-1': 'is-hidden'}
            },
            {
                toggleElem: '["test-elem-1" , "test-elem-2"]',
                classes: {'test-elem-1': 'is-hidden', 'test-elem-2': 'is-hidden'}
            },
            {
                toggleElem: '[ "test-elem-3" ]',
                classes: {'test-elem-3': ''}
            }
        ];

        beforeEach(() => {
            _.forEach(fakeElems, elem => {
                $('body').append('<div id="' + elem.id + '"></div>');

                if (elem.cls) {
                    $('#' + elem.id).addClass(elem.cls);
                }
            });
        });

        afterEach(() => {
            _.forEach($('div'), elem => {
                $(elem).remove();
            });
        });

        _.forEach(scenarios, scenario => {
            it('should correctly toggle is-hidden classes in ' + scenario.toggleElem, () => {
                hirespace.ToggleElem.toggle(scenario.toggleElem);

                _.forEach(scenario.classes, (classes, id) => {
                    let elem = $('#' + id);

                    expect(elem.attr('class')).toEqual(classes);
                });
            });
        });
    });
}