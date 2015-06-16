This application consists of 3 main parts:
 
**Node.js backend server - a light-weight playground for creating rich prototypes**<br>
Language: TypeScript<br>
Dependencies: express, expect.js, mocha, node.js

**Custom Sass framework + image assets**<br>
Language: Sass<br>
Dependencies: image assets in /images

**Tailored Front-End framework**<br>
Language: TypeScript<br>
Dependencies: Jasmine, jQuery, knockout, lodash, rxjs

**Should you consider editing, or contributing to this project, please read the [To Contribute](#contributing) section**

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

and then create a pull request (from your **develop** branch).

### Using the Front-End application

#### toggle-class

The most powerful part of the application is the ```ToggleClass``` model. It enables you to toggle classes on any HTML
element based on rules (or their combinations), the number of which is unlimited.

For example, to toggle class active only when there is an object called ```bookingData``` attached to the current
controller, do:

        <elem toggle-class="active: bookingData"></elem>
        
Should you wish to add an *OR assertion*, for example ```customerData.type == 'admin'```, you can do:

        <elem toggle-class="active: bookingData || customerData.role == 'admin'"></elem>
        
To add a *AND assertion*, you might do:

        <elem toggle-class="active: bookingData.venue.manager && bookingData.venue.name"></elem>

**More features to be documented overtime.**

## To deploy

There are a couple of things you need to do before you can perform a release. First off, please take a few moments to
familiarise yourself with [Divshot](http://docs.divshot.com/guides/getting-started). Secondly, make sure you have the
correct admin rights (can be obtained from slavomir@hirespace.com or will@hirespace.com) and that you have Divshot's
CLI installed:

        npm install -g divshot-cli
        
Prior to making a release, **ensure your develop branch is up to date** and then **checkout a new release branch using
git-flow**. I have set up both **bump-version.sh** and **release.sh** scripts so these should be executed while on the
(release) branch.

bump-version.sh merely bumps the version number in bower.json and package.json and release.sh does following:

1. Runs gulp commands which deploy production-ready assets and runs all tests to ensure nothing has broken
2. Prompts ```divshot login```
3. (Re)creates the **/dist** folder
4. Copies all dependencies over to **/dist** folder
5. Pushes to **staging**
6. Asks whether you want to **promote staging to production**

## Other

Bootstrap grid system docs [here](http://getbootstrap.com/css/#grid).

Proxy setup:

        # Given Pow is installed
        echo 6065 > ~/.pow/static.hirespace