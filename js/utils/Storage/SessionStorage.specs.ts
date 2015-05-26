module hirespace.specs {
    'use strict';

    let testData = {
        number: 1,
        boolean: true,
        string: 'Hello World',
        object: {value: 'Hello World'},
        array: ['Hello', 'World']
    };

    describe('SessionStorage', () => {
        afterEach(() => {
            window.sessionStorage.clear();
        });

        it('should have the set method', () => {
            expect(hirespace.SessionStorage.set).toBeDefined();
        });

        it('should set values into window.sessionStorage', () => {
            _.forEach(testData, (value, key) => {
                let setSessionStorage = hirespace.SessionStorage.set(key, value);

                expect(setSessionStorage).toBe(true);
                expect(window.sessionStorage.getItem(key)).toEqual(JSON.stringify(value));
            });
        });

        it('should have the get method', () => {
            expect(hirespace.SessionStorage.get).toBeDefined();
        });

        it('should get values from window.sessionStorage', () => {
            _.forEach(testData, (value, key) => {
                hirespace.SessionStorage.set(key, value);

                let getSessionStorage = hirespace.SessionStorage.get(key);

                expect(getSessionStorage).toEqual(value);
            });
        });

        it('should have the remove method', () => {
            expect(hirespace.SessionStorage.remove).toBeDefined();
        });

        it('should remove values from window.sessionStorage', () => {
            _.forEach(testData, (value, key) => {
                hirespace.SessionStorage.set(key, value);

                let removeSessionStorage = hirespace.SessionStorage.remove(key);

                expect(removeSessionStorage).toBe(true);
                expect(hirespace.SessionStorage.get(key)).toBe(false);
            });
        });
    });
}