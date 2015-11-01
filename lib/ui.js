const buttons = require("sdk/ui/button/action");
const simplePreferences = require("sdk/simple-prefs");
const timers = require("sdk/timers");

const constants = require("./constants");

let button;
let indicatorTimeout;

function __clearTimeout() {
    if (indicatorTimeout) {
        timers.clearTimeout(indicatorTimeout);
    }
}

function __refreshButton() {
    if (button) {
        const preferences = simplePreferences.prefs;
        button.label = preferences.enabled ? constants.labelOn : constants.labelOff;
        button.icon = preferences.enabled ? constants.iconOn : constants.iconOff;
    }
}

function makeButton() {
    const preferences = simplePreferences.prefs;

    button = buttons.ActionButton({
        id: "skip-redirect-button",
        label: constants.labelOn,
        icon: constants.iconOn,
        onClick: function() { preferences.enabled = !preferences.enabled; },
    });

    __refreshButton();
    simplePreferences.on("enabled", __refreshButton);
}

exports.makeButton = makeButton;

function destroyButton() {
    __clearTimeout();
    simplePreferences.removeListener("enabled", __refreshButton);
    if (button) {
        button.destroy();
        button = null;
    }
}

exports.destroyButton = destroyButton;

function indicateSkip(from, to) {
    __clearTimeout();
    if (button) {
        button.badge = constants.buttonBadge;
        button.label = constants.labelOn + constants.buttonRedirect + from + "\n->\n" + to;
        const duration = 1000 * simplePreferences.prefs.indicationDuration;
        indicatorTimeout = timers.setTimeout(function() { button.badge = ""; }, duration);
    }
}

exports.indicateSkip = indicateSkip;
