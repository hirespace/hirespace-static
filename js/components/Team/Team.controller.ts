module hirespace {
    'use strict';

    class SignUp {
        text: string;

        constructor(text) {
            this.text = text;
        }
    }

    export class TeamController {
        signup: SignUp;

        constructor() {
            console.log('Team Page');

            this.signup = new SignUp('Top venues to your inbox');

            hirespace.View.updateView(this, 'footer');
        }
    }

    hirespace.App.subscribe('TeamController', TeamController);
}