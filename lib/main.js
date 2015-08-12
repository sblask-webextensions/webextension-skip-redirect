const events = require("sdk/system/events");
const interfaces = require("chrome").Ci;

const ui = require("./ui.js");
const url = require("./url.js");
const utils = require("./utils.js");

ui.makeButton();

function listener(event) {
    var subject = event.subject;
    subject.QueryInterface(interfaces.nsIHttpChannel);

    var isDocumentLoad = subject.loadFlags & subject.LOAD_INITIAL_DOCUMENT_URI;
    if (!isDocumentLoad) {
        return;
    }

    var original = subject.URI.spec;
    var redirectTarget = url.getRedirectTarget(original);
    if (redirectTarget == original) {
        return;
    }

    console.log("Redirect " + original + " to " + redirectTarget);
    ui.indicateSkip(original, redirectTarget);
    subject.redirectTo(utils.makeURI(redirectTarget));
}

events.on("http-on-opening-request", listener);
