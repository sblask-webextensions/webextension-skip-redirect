/* global url */
const MODE = "mode";
const MODE_OFF = "off";
const MODE_BLACKLIST = "blacklist";

const BLACKLIST = "blacklist";
const WHITELIST = "whitelist";

const ICON           = "icon.svg";
const ICON_OFF       = "icon-off.svg";
const ICON_BLACKLIST = "icon-blacklist.svg";
const ICON_WHITELIST = "icon-whitelist.svg";

const GLOBAL_BLACKLIST = [
    "/abp",
    "/account",
    "/auth",
    "/cookie",
    "/download",
    "/login",
    "/logout",
    "/preferences",
    "/profile",
    "/register",
    "/signin",
    "/signoff",
    "/signon",
    "/signout",
    "/signup",
    "/subscribe",
    "/verification",
];

let currentMode = undefined;
let blacklist = [];
let whitelist = [];

browser.runtime.sendMessage("get-simple-preferences").then(reply => {
    if (reply) {
        browser.storage.local.get([MODE, BLACKLIST, WHITELIST])
            .then(
                (result) => {
                    if (result[BLACKLIST] === undefined) {
                        browser.storage.local.set({[BLACKLIST]: GLOBAL_BLACKLIST.concat(reply.blacklist.split("|"))});
                    } else {
                        updateBlacklist(result[BLACKLIST]);
                    }

                    if (result[WHITELIST] === undefined) {
                        browser.storage.local.set({[WHITELIST]: []});
                    } else {
                        updateWhitelist(result[WHITELIST]);
                    }

                    if (result[MODE] === undefined) {
                        if (reply.enabled) {
                            browser.storage.local.set({[MODE]: MODE_BLACKLIST});
                        } else {
                            disableSkipping();
                        }
                    } else if (result[MODE] === MODE_OFF) {
                        disableSkipping();
                    } else {
                        enableSkipping(result[MODE]);
                    }
                }
            );
    }
});

browser.storage.onChanged.addListener(
    (changes) => {
        console.log(changes);
        if (changes[BLACKLIST]) {
            updateBlacklist(changes[BLACKLIST].newValue);
        }

        if (changes[WHITELIST]) {
            updateWhitelist(changes[WHITELIST].newValue);
        }

        if (changes[MODE]) {
            if (changes[MODE].newValue === MODE_OFF) {
                disableSkipping();
            } else {
                enableSkipping(changes[MODE].newValue);
            }
        }
    }
);

function updateBlacklist(newBlacklist) {
    blacklist = newBlacklist.filter(Boolean);
}

function updateWhitelist(newWhitelist) {
    whitelist = newWhitelist.filter(Boolean);
}

function enableSkipping(mode) {
    browser.webRequest.onBeforeRequest.removeListener(maybeRedirect);

    currentMode = mode;
    if (mode === MODE_BLACKLIST) {
        browser.webRequest.onBeforeRequest.addListener(
            maybeRedirect,
            {urls: ["<all_urls>"], types: ["main_frame"]},
            ["blocking"]
        );
        browser.browserAction.setIcon({path: ICON_BLACKLIST});
    } else {
        browser.webRequest.onBeforeRequest.addListener(
            maybeRedirect,
            {urls: whitelist, types: ["main_frame"]},
            ["blocking"]
        );
        browser.browserAction.setIcon({path: ICON_WHITELIST});
    }

    browser.browserAction.setTitle({title: "Skip Redirect is enabled, click to disable"});
}

function disableSkipping() {
    browser.webRequest.onBeforeRequest.removeListener(maybeRedirect);

    browser.browserAction.setIcon({path: ICON_OFF});
    browser.browserAction.setTitle({title: "Skip Redirect is disabled, click to enable"});
}

function maybeRedirect(requestDetails) {
    if (requestDetails.tabId === -1 || requestDetails.method === "POST") {
        return;
    }

    if (currentMode === MODE_BLACKLIST && new RegExp("(" + blacklist.join("|") + ")").test(requestDetails.url)) {
        return;
    }

    const redirectTarget = url.getRedirectTarget(requestDetails.url);
    if (redirectTarget == requestDetails.url) {
        return;
    }

    notifySkip(requestDetails.url, redirectTarget);

    return {
        redirectUrl: redirectTarget,
    };
}

function notifySkip(from, to) {
    browser.notifications.create("notify-skip", {
        type: "basic",
        iconUrl: browser.extension.getURL(ICON),
        title: "Skipped Redirect",
        message: from + "\n->\n" + to,
    });
}
