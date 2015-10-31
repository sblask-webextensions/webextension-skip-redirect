const events = require("sdk/system/events");
const interfaces = require("chrome").Ci;
const simplePreferences = require("sdk/simple-prefs");

const ui = require("./ui");
const url = require("./url");
const utils = require("./utils");

function listener(event) {
    let subject = event.subject;
    subject.QueryInterface(interfaces.nsIHttpChannel);

    let isDocumentLoad = subject.loadFlags & subject.LOAD_INITIAL_DOCUMENT_URI;
    if (!isDocumentLoad) {
        return;
    }

    let preferences = simplePreferences.prefs;
    if (!preferences.enabled) {
        return;
    }

    let original = subject.URI.spec;
    let redirectTarget = url.getRedirectTarget(original);
    if (redirectTarget == original) {
        return;
    }

    console.log("Redirect " + original + " to " + redirectTarget);
    ui.indicateSkip(original, redirectTarget);
    subject.redirectTo(utils.makeURI(redirectTarget));
}

exports.main = function(options) {
    console.log("Starting up with reason ", options.loadReason);

    ui.makeButton();
    events.on("http-on-opening-request", listener);
};
