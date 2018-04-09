
## Technologies Used

-  React
-  Redux
-  Firebase
-  Google Cloud Functions

## Installation
First, make sure you have the latest versions of node, npm, and [bower](https://www.npmjs.org/package/bower) installed. Then follow the steps below (you may need to use sudo):

- Clone the repo: `git@github.com:webmasterdragon/react-firebase-fabricjs.git`.
- Install Node LTS via [https://nodejs.org/en/](https://nodejs.org/en/)
- Run `npm install -g npm` (update npm) - May need 'sudo'
- Run `npm install` to setup node packages it uses in tasks.

- Run `npm start` to start React scripts and launch the development server http://localhost:3000/

## Push Production Code to Firebase

-  Run `npm run build` to create an optimized production build in the /build folder.
-  Run `firebase use --add` to add the hopscotch-4a440 project
-  Run `firebase deploy --only hosting` to deploy only the /build folder to Firebase hosting.  

Notes:
-  Make sure package.json has set the "homepage" value set to empty ""

### Push Cloud Functions

-  Run `firebase init functions` to initialize a Firebase project in the main directory
   -  A functions directory will be created in your project with a Node.js package pre-configured. Functions can be deployed with firebase deploy.
-  Select `Javascript` as language
-  Yes on ESLint
-  Don't overwrite package.json, .eslintrc.json, or index.js
-  Install Dependencies with NPM
-  Run `firebase deploy --only functions` to deploy Functions to both Google Cloud Functions and Firebase 

### Third Party Software
-  MailGun (https://www.mailgun.com/) - Used for application emails - Cloud Function is `mailGunFunction`
-  Cloud Convert (https://cloudconvert.com/) - Converts all documents to HTML and generates a thumbnail image for each.  Cloud function is `CloudConvertApi`



