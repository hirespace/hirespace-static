module hirespace.specs {
    'use strict';

    describe('Base64 model', () => {
        let scenarios = [
            {string: 'm(xM(i#v;M{7PZ\'0', encoded: 'bSh4TShpI3Y7TXs3UFonMA=='},
            {string: 'Networking Event', encoded: 'TmV0d29ya2luZyBFdmVudA=='},
            {string: 'my6+uIe;qm5U+"bN', encoded: 'bXk2K3VJZTtxbTVVKyJiTg=='},
            {string: 'private investor events', encoded: 'cHJpdmF0ZSBpbnZlc3RvciBldmVudHM='}
        ];

        _.forEach(scenarios, scenario => {
            it('should correctly encode ' + scenario.string, () => {
                expect(hirespace.Base64.encode(scenario.string)).toEqual(scenario.encoded);
            });

            it('should correctly decode ' + scenario.encoded, () => {
                expect(hirespace.Base64.decode(scenario.encoded)).toEqual(scenario.string);
            });
        });
    });
}