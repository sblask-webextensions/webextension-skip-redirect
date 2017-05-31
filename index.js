const preferences = require("sdk/simple-prefs").prefs;
const webExtension = require("sdk/webextension");

webExtension.startup().then(api => {
    const {browser} = api;
    browser.runtime.onMessage.addListener((message, _sender, sendReply) => {
        if (message == "get-simple-preferences") {
            sendReply({
                enabled: preferences.enabled || false,
                blacklist: preferences.exceptions || "",
            });
        }
    });
});
