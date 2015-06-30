function makeButton() {
    var buttons = require('sdk/ui/button/action');
    var simplePreferences = require('sdk/simple-prefs');

    var constants = require("./constants.js");
    var preferences = simplePreferences.prefs;

    var button = buttons.ActionButton({
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

exports.makeButton = makeButton;
