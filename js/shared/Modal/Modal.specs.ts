module hirespace.specs {
    'use strict';

    describe('Modal', () => {
        it('should listen for clicks on elements with toggle-modal class', () => {
            expect(hirespace.Modal.listen).toBeDefined();
        });
    });
}