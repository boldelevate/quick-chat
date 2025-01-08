/* initializations */

// https://docs.google.com/spreadsheets/d/e/2PACX-1vQzXmUtM791v3cI6qtSD7ZAVFprLEPviwgsUBrJNmgYysMwckx7EdCR-4AbRiaSgXFzG-t0HDJIi4A0/pub?output=csv

$(() => {

    if (getUserDetails() === null) {
        localStorage.clear();
        showLogin();
    } else {
        initApp();
    }

});

