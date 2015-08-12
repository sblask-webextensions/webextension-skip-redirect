const buttons = require('sdk/ui/button/action');
const simplePreferences = require('sdk/simple-prefs');
const timers = require("sdk/timers");

const constants = require("./constants.js");

var button;
var indicatorTimeout;

function makeButton() {
    var preferences = simplePreferences.prefs;

    button = buttons.ActionButton({
        id: "skip-redirect-button",
        label: constants.labelOn,
        icon: constants.iconOn,
        onClick: function(){ preferences.enabled = !preferences.enabled; }
    });

    function refreshButton() {
        button.label = preferences.enabled ? constants.labelOn : constants.labelOff;
        button.icon = preferences.enabled ? constants.iconOn : constants.iconOff;
    }

    refreshButton();
    simplePreferences.on("enabled", refreshButton);
}

function indicateSkip(from, to) {
    timers.clearTimeout(indicatorTimeout);
    if (button) {
        button.badge = constants.buttonBadge;
        button.label = constants.labelOn + constants.buttonRedirect + from + "\n->\n" + to;
        let duration = 1000 * simplePreferences.prefs.indicationDuration;
        indicatorTimeout = timers.setTimeout(function(){ button.badge = ""; }, duration);
    }
}

exports.makeButton = makeButton;
exports.indicateSkip = indicateSkip;
