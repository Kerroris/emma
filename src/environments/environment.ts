// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAdoLmoo_lgFLvCDCI0HJiMQzjq03GcwvU",
    authDomain: "practicapwa-218f6.firebaseapp.com",
    projectId: "practicapwa-218f6",
    storageBucket: "practicapwa-218f6.firebasestorage.app",
    messagingSenderId: "484591424720",
    appId: "1:484591424720:web:4cd3f5f9c8a8173581fad5",
    measurementId: "G-5ZSQ5YGXJT"
  },
  function_login: "https://us-central1-mvc-kcm-448600.cloudfunctions.net/login-cal",
  function_registro: "https://us-central1-mvc-kcm-448600.cloudfunctions.net/register-cal",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
