
/* initializations */

const dataSets = {
    "jaipur": affluentBusinessesJaipur,
    "noida": affluentBusinessesNoida,
    "udaipur": affluentBusinessesUdaipur,
}

let current = null;

$(() => {
    loadMenu(dataSets);
    loadNavBar(dataSets);
    // loadDataSetInApp("jaipur", dataSets.jaipur);
});

