module hirepace.specs {
    'use strict';

    describe('Notification model', () => {
        $('body').append('<div id="notification" class="dummy-class"></div>');

        it('should have the generate() method', () => {
            expect(hirespace.Notification.generate).toBeDefined();
        });

        it('should reset classes attached to the notification element and set new classes onto it', () => {
            hirespace.Notification.generate('Test', 'error');

            expect($('#notification').attr('class')).toEqual('active error');
        });

        it('should render a main element with correct content into the notification element', () => {
            hirespace.Notification.generate('Hello, World!', 'success');

            expect($('#notification main').html()).toEqual('Hello, World!');
        });
    });
}