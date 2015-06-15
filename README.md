This application consists of 3 main parts:
 
**Node.js backend server - a light-weight playground for creating rich prototypes**

Language: TypeScript

Dependencies: express, expect.js, mocha, node.js

**Custom Sass framework + image assets**

Language: Sass

Dependencies: image assets in /images

**Tailored Front-End framework**

Language: TypeScript

Dependencies: Jasmine, jQuery, knockout, lodash, rxjs

Should you consider editing, or contributing to this project, please read the [To Contribute](#contributing) section

## Setup

        # Install node, if you don't have it already
        brew install node
        
        # Clone repo
        git clone https://github.com/hirespace/hirespace-static.git
        
        # cd in and run install script (will prompt for password)
        cd hirespace-static
        ./install.sh

## To run

        # After setup
        gulp
        
The server runs on port **6065**, the tests run on port **6066**.
You can change these settings in ```gulpfile.js``` and ```js/test/karma.conf.js```.

## <a name="contributing"></a>To contribute

I recommend using the WebStorm IDE. Please make sure you have
[the correct code style settings](https://github.com/slavomirvojacek/useful/tree/master/JetBrains)
before you contribute in form of a pull request. JSHint will be introduced overtime.

### Using git

We use git-flow, and so it would be good to try and stick to the convention. Please use the default branch prefixes.

                # Install git-flow
                brew install git-flow

If possible, development should happen on **a separate feature branch named after a JIRA ticket reference** (if applicable).

                # This will create a new branch called feature/HS-...
                git flow feature start HS-...

To finish a feature, run

                git flow feature finish HS-...

and then create a pull request (**develop** branch).

### Using the framework

...

## Other

Bootstrap grid system docs [here](http://getbootstrap.com/css/#grid).

Proxy setup:

        # Given Pow is installed
        echo 6065 > ~/.pow/static.hirespace