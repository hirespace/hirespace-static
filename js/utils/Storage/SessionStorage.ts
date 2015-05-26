module hirespace {
    'use strict';

    export class SessionStorage {
        static set(key: string, value: any): boolean {
            let setValue: string = JSON.stringify(value);

            window.sessionStorage.setItem(key, setValue);
            return true;
        }

        static get(key: string): any {
            let getValue = window.sessionStorage.getItem(key);

            return getValue ? JSON.parse(getValue) : false;
        }

        static remove(key: string): boolean {
            if (hirespace.SessionStorage.get(key)) {
                window.sessionStorage.removeItem(key);
                return true;
            }

            return false;
        }
    }
}