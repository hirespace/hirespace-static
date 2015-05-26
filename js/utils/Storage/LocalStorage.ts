module hirespace {
    'use strict';

    export class LocalStorage {
        static set(key: string, value: any): boolean {
            let setValue: string = JSON.stringify(value);

            window.localStorage.setItem(key, setValue);
            return true;
        }

        static get(key: string): any {
            let getValue = window.localStorage.getItem(key);

            return getValue ? JSON.parse(getValue) : false;
        }

        static remove(key: string): boolean {
            if (hirespace.LocalStorage.get(key)) {
                window.localStorage.removeItem(key);
                return true;
            }

            return false;
        }
    }
}