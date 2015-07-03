var events = require("sdk/system/events");
var interfaces = require("chrome").Ci;

var ui = require("./ui.js");
var url = require("./url.js");
var utils = require("./utils.js");

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
