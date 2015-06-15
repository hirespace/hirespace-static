module hirespace {
    'use strict';

    export class HomeController {
        name: string;

        constructor() {
            hirespace.Tabs.listen();

            $.ajax('http://stagingmongoapi.hirespace.com/bookings/QJ8tFLRfe5Khgvurt', {
                    type: 'get',
                    headers: {
                        'Authorization': 'Basic cUFES1lybW03SnA4WlhSWlQ='
                    }
                }
            );
        }
    }

    hirespace.App.subscribe('HomeController', HomeController);
}