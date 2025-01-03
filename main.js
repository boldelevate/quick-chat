
/* initializations */

const dataSets = {
    "jaipur": affluentBusinessesJaipur,
    "noida": affluentBusinessesNoida,
    "udaipur": affluentBusinessesUdaipur,
    "chandigarh": affluentBusinessesChandigarh,
}

let current = null;

$(() => {
    loadMenu(dataSets);
    loadNavBar(dataSets);
    // loadDataSetInApp("jaipur", dataSets.jaipur);
});

