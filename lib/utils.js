require("chrome").Cu.import("resource://gre/modules/Services.jsm");

function makeURI(string) {
    /* globals Services */
    return Services.io.newURI(string, null, null);
}
exports.makeURI = makeURI;
