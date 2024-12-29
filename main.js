
/* initializations */

const dataSets = {
    "jaipur": affluentBusinessesJaipur,
    "noida": affluentBusinessesNoida,
}

let current = null;

$(() => {
    loadMenu(dataSets);
    loadNavBar(dataSets);
    // loadDataSetInApp("jaipur", dataSets.jaipur);
});

