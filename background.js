/* global psl */
/* global url */

const OPTION_MODE = "mode";

const OPTION_MODE_OFF = "off";
const OPTION_MODE_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_MODE_SKIP_URLS_LIST = "whitelist";

const OPTION_NO_SKIP_PARAMETERS_LIST = "no-skip-parameters-list";
const OPTION_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_SKIP_URLS_LIST = "whitelist";

const OPTION_NOTIFICATION_POPUP_ENABLED = "notificationPopupEnabled";
const OPTION_NOTIFICATION_DURATION = "notificationDuration";

const OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN = "skipRedirectsToSameDomain";

const CONTEXT_MENU_ID = "copy-last-source-url";
const NOTIFICATION_ID = "notify-skip";

const ICON = "icon.svg";
const ICON_OFF = "icon-off.svg";
const ICON_NO_SKIP_URLS_LIST = "icon-no-skip-urls-list.svg";
const ICON_SKIP_URLS_LIST = "icon-skip-urls-list.svg";

const MAX_NOTIFICATION_URL_LENGTH = 100;

const DEFAULT_NO_SKIP_PARAMETERS_LIST = [
    "from",
    "ref",
    "referer",
    "referrer",
    "source",
];

const DEFAULT_NO_SKIP_URLS_LIST = [
    "/abp",
    "/account",
    "/adfs",
    "/auth",
    "/cookie",
    "/download",
    "/login",
    "/logoff",
    "/logon",
    "/logout",
    "/oauth",
    "/preferences",
    "/profile",
    "/register",
    "/saml",
    "/signin",
    "/signoff",
    "/signon",
    "/signout",
    "/signup",
    "/sso",
    "/subscribe",
    "/unauthenticated",
    "/verification",
];

let currentMode = undefined;

let noSkipParametersList = [];
let noSkipUrlsList = [];
let skipUrlsList = [];

let lastSourceURL = undefined;

let notificationPopupEnabled = undefined;
let notificationDuration = undefined;

let skipRedirectsToSameDomain = false;

let notificationTimeout = undefined;

browser.storage.local.get([
    OPTION_MODE,
    OPTION_NO_SKIP_PARAMETERS_LIST,
    OPTION_NO_SKIP_URLS_LIST,
    OPTION_SKIP_URLS_LIST,
    OPTION_NOTIFICATION_POPUP_ENABLED,
    OPTION_NOTIFICATION_DURATION,
    OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN,
])
    .then(
        (result) => {
            if (result[OPTION_NO_SKIP_PARAMETERS_LIST] === undefined) {
                browser.storage.local.set({[OPTION_NO_SKIP_PARAMETERS_LIST]: DEFAULT_NO_SKIP_PARAMETERS_LIST});
            } else {
                updateNoSkipParametersList(result[OPTION_NO_SKIP_PARAMETERS_LIST]);
            }

            if (result[OPTION_NO_SKIP_URLS_LIST] === undefined) {
                browser.storage.local.set({[OPTION_NO_SKIP_URLS_LIST]: DEFAULT_NO_SKIP_URLS_LIST});
            } else {
                updateNoSkipUrlsList(result[OPTION_NO_SKIP_URLS_LIST]);
            }

            if (result[OPTION_SKIP_URLS_LIST] === undefined) {
                browser.storage.local.set({[OPTION_SKIP_URLS_LIST]: []});
            } else {
                updateSkipUrlsList(result[OPTION_SKIP_URLS_LIST]);
            }

            if (result[OPTION_MODE] === undefined) {
                browser.storage.local.set({[OPTION_MODE]: OPTION_MODE_NO_SKIP_URLS_LIST});
                currentMode = OPTION_MODE_NO_SKIP_URLS_LIST;
            } else {
                currentMode = result[OPTION_MODE];
            }

            if (currentMode === OPTION_MODE_OFF) {
                disableSkipping();
            } else {
                enableSkipping();
            }

            if (result[OPTION_NOTIFICATION_POPUP_ENABLED] === undefined) {
                browser.storage.local.set({[OPTION_NOTIFICATION_POPUP_ENABLED]: true});
            } else {
                notificationPopupEnabled = result[OPTION_NOTIFICATION_POPUP_ENABLED];
            }

            if (result[OPTION_NOTIFICATION_DURATION] === undefined) {
                browser.storage.local.set({[OPTION_NOTIFICATION_DURATION]: 3});
            } else {
                notificationDuration = result[OPTION_NOTIFICATION_DURATION];
            }

            if (result[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN] === undefined) {
                browser.storage.local.set({[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN]: false});
            } else {
                skipRedirectsToSameDomain = result[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN];
            }

        }
    );

browser.storage.onChanged.addListener(
    (changes) => {
        if (changes[OPTION_NO_SKIP_PARAMETERS_LIST]) {
            updateNoSkipParametersList(changes[OPTION_NO_SKIP_PARAMETERS_LIST].newValue);
        }

        if (changes[OPTION_NO_SKIP_URLS_LIST]) {
            updateNoSkipUrlsList(changes[OPTION_NO_SKIP_URLS_LIST].newValue);
        }

        if (changes[OPTION_SKIP_URLS_LIST]) {
            updateSkipUrlsList(changes[OPTION_SKIP_URLS_LIST].newValue);
        }

        if (changes[OPTION_MODE]) {
            currentMode = changes[OPTION_MODE].newValue;
        }

        if (currentMode === OPTION_MODE_OFF) {
            disableSkipping();
        } else {
            enableSkipping();
        }

        if (changes[OPTION_NOTIFICATION_POPUP_ENABLED]) {
            notificationPopupEnabled = changes[OPTION_NOTIFICATION_POPUP_ENABLED].newValue;
        }

        if (changes[OPTION_NOTIFICATION_DURATION]) {
            notificationDuration = changes[OPTION_NOTIFICATION_DURATION].newValue;
        }

        if (changes[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN]) {
            skipRedirectsToSameDomain = changes[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN].newValue;
        }

    }
);

browser.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: browser.i18n.getMessage("contextMenuLabel"),
    contexts: ["browser_action"],
    enabled: false,
});

browser.contextMenus.onClicked.addListener(
    (info, _tab) => {
        if (info.menuItemId === CONTEXT_MENU_ID) {
            copyLastSourceURLToClipboard();
        }
    }
);

function copyLastSourceURLToClipboard() {
    chainPromises([
        ()        => { return browser.tabs.executeScript({ code: "typeof copyToClipboard === 'function';" }); },
        (results) => { return injectScriptIfNecessary(results && results[0]); },
        ()        => { return browser.tabs.executeScript({ code: `copyToClipboard("${lastSourceURL}")` }); },
    ]);
}

function injectScriptIfNecessary(isCopyFunctionDefined) {
    if (!isCopyFunctionDefined) {
        return browser.tabs.executeScript({ file: "clipboard-helper.js" });
    }
}

function updateNoSkipParametersList(newNoSkipParametersList) {
    noSkipParametersList = newNoSkipParametersList.filter(Boolean);
}

function updateNoSkipUrlsList(newNoSkipUrlsList) {
    noSkipUrlsList = newNoSkipUrlsList.filter(Boolean);
}

function updateSkipUrlsList(newSkipUrlsList) {
    skipUrlsList = newSkipUrlsList.filter(Boolean);
}

function enableSkipping() {
    browser.webRequest.onBeforeRequest.removeListener(maybeRedirect);

    if (currentMode === OPTION_MODE_NO_SKIP_URLS_LIST) {
        browser.webRequest.onBeforeRequest.addListener(
            maybeRedirect,
            {urls: ["<all_urls>"], types: ["main_frame"]},
            ["blocking"]
        );
        browser.browserAction.setIcon({path: ICON_NO_SKIP_URLS_LIST});
    } else if (currentMode === OPTION_MODE_SKIP_URLS_LIST) {
        if (skipUrlsList.length > 0) {
            browser.webRequest.onBeforeRequest.addListener(
                maybeRedirect,
                {urls: skipUrlsList, types: ["main_frame"]},
                ["blocking"]
            );
        }

        browser.browserAction.setIcon({path: ICON_SKIP_URLS_LIST});
    }

    browser.browserAction.setBadgeBackgroundColor({color: "red"});
    browser.browserAction.setTitle({title: browser.i18n.getMessage("browserActionLabelOn")});
}

function disableSkipping() {
    browser.webRequest.onBeforeRequest.removeListener(maybeRedirect);

    browser.browserAction.setIcon({path: ICON_OFF});
    browser.browserAction.setTitle({title: browser.i18n.getMessage("browserActionLabelOff")});
}

function maybeRedirect(requestDetails) {
    if (requestDetails.tabId === -1 || requestDetails.method === "POST") {
        return;
    }

    const parameterExceptions = noSkipParametersList;
    let urlExceptions = [];
    if (currentMode === OPTION_MODE_NO_SKIP_URLS_LIST) {
        urlExceptions = noSkipUrlsList;
    }

    const redirectTarget = url.getRedirectTarget(requestDetails.url, urlExceptions, parameterExceptions);
    if (redirectTarget === requestDetails.url) {
        return;
    }

    if (currentMode === OPTION_MODE_NO_SKIP_URLS_LIST && !skipRedirectsToSameDomain) {
        const sourceHostname = getHostname(requestDetails.url);
        const targetHostname = getHostname(redirectTarget);
        const sourceDomain = psl.getDomain(sourceHostname);
        const targetDomain = psl.getDomain(targetHostname);
        if (sourceDomain === targetDomain) {
            return;
        }
    }

    prepareContextMenu(requestDetails.url);
    notifySkip(requestDetails.url, redirectTarget);

    return {
        redirectUrl: redirectTarget,
    };
}

function prepareContextMenu(from) {
    if (lastSourceURL === undefined) {
        browser.contextMenus.update(CONTEXT_MENU_ID, {enabled: true});
    }
    lastSourceURL = from;
}

function notifySkip(from, to) {
    if (notificationTimeout) {
        clearNotifications();
    }

    const notificationMessage = browser.i18n.getMessage("redirectSkippedNotificationMessage", [cleanUrl(from), cleanUrl(to)]);

    const toolbarButtonTitle = browser.i18n.getMessage("browserActionLabelOnSkipped", [from, to]);

    if (notificationPopupEnabled) {
        browser.notifications.create(NOTIFICATION_ID, {
            type: "basic",
            iconUrl: browser.extension.getURL(ICON),
            title: browser.i18n.getMessage("redirectSkippedNotificationTitle"),
            message: notificationMessage,
        });
    }
    browser.browserAction.setBadgeText({text: browser.i18n.getMessage("redirectSkippedBrowserActionBadge")});

    browser.browserAction.setTitle({title: toolbarButtonTitle});

    notificationTimeout = setTimeout(clearNotifications, 1000 * notificationDuration);
}

function clearNotifications() {
    clearTimeout(notificationTimeout);
    notificationTimeout = undefined;
    browser.notifications.clear(NOTIFICATION_ID);
    browser.browserAction.setBadgeText({text: ""});
}

function cleanUrl(string) {
    if (string.length > MAX_NOTIFICATION_URL_LENGTH) {
        string = string.substring(0, MAX_NOTIFICATION_URL_LENGTH - 3) + "...";
    }

    return string.replace(/&/g, "&amp;");
}

function getHostname(url) {
    const a = document.createElement("a");
    a.href = url;
    return a.hostname;
}

function chainPromises(functions) {
    let promise = Promise.resolve();
    for (const function_ of functions) {
        promise = promise.then(function_);
    }

    return promise.catch((error) => { console.warn(error.message); });
}
