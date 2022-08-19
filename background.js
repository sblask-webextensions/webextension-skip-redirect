importScripts("base64.js");
importScripts("pslrules.js");
importScripts("psl.js");
importScripts("url.js");
importScripts("util.js");

/* global psl */
/* global url */
/* global util */

const OPTION_MODE = "mode";

const OPTION_MODE_OFF = "off";
const OPTION_MODE_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_MODE_SKIP_URLS_LIST = "whitelist";

const OPTION_NO_SKIP_PARAMETERS_LIST = "no-skip-parameters-list";
const OPTION_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_SKIP_URLS_LIST = "whitelist";
const OPTION_SYNC_LISTS_ENABLED = "syncListsEnabled";

const OPTION_INDICATOR_ENABLED = "indicatorEnabled";

const OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN = "skipRedirectsToSameDomain";

const LIST_OPTIONS = [
    OPTION_NO_SKIP_PARAMETERS_LIST,
    OPTION_NO_SKIP_URLS_LIST,
    OPTION_SKIP_URLS_LIST,
];

const ICON = "icon";
const ICON_OFF = "icon-off";
const ICON_NO_SKIP_URLS_LIST = "icon-no-skip-urls-list";
const ICON_SKIP_URLS_LIST = "icon-skip-urls-list";

const MAX_NOTIFICATION_URL_LENGTH = 100;

const DEFAULT_NO_SKIP_PARAMETERS_LIST = [
    "from",
    "ref",
    "ref_url",
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
    "/openid",
    "/pay",
    "/preference",
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
    "/translate",
    "/unauthenticated",
    "/verification",
];

let currentMode = undefined;

let noSkipParametersList = [];
let noSkipUrlsList = [];
let skipUrlsList = [];

let indicatorEnabled = undefined;

let skipRedirectsToSameDomain = false;
let syncLists = false;

if (typeof browser == "undefined") {
    browser = chrome;
}

browser.storage.local.get(
    [
        OPTION_MODE,
        OPTION_INDICATOR_ENABLED,
        OPTION_NO_SKIP_PARAMETERS_LIST,
        OPTION_NO_SKIP_URLS_LIST,
        OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN,
        OPTION_SKIP_URLS_LIST,
        OPTION_SYNC_LISTS_ENABLED,
    ],
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

        if (result[OPTION_INDICATOR_ENABLED] === undefined) {
            browser.storage.local.set({[OPTION_INDICATOR_ENABLED]: true});
        } else {
            indicatorEnabled = result[OPTION_INDICATOR_ENABLED];
        }

    if (result[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN] === undefined) {
            browser.storage.local.set({[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN]: false});
        } else {
            skipRedirectsToSameDomain = result[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN];
        }

        if (result[OPTION_SYNC_LISTS_ENABLED] === undefined) {
            browser.storage.local.set({[OPTION_SYNC_LISTS_ENABLED]: false});
        } else {
            syncLists = result[OPTION_SYNC_LISTS_ENABLED];
        }
    }
);

browser.storage.onChanged.addListener(
    (changes, areaName) => {

        let initTriggered = false;
        if (changes[OPTION_SYNC_LISTS_ENABLED]) {
            const previousValue = syncLists;
            const newValue = changes[OPTION_SYNC_LISTS_ENABLED].newValue;
            syncLists = newValue;
            if (previousValue !== newValue && syncLists) {
                initTriggered = true;
                initSyncLists();
            }
        }

        if (changes[OPTION_NO_SKIP_PARAMETERS_LIST]) {
            updateNoSkipParametersList(changes[OPTION_NO_SKIP_PARAMETERS_LIST].newValue);
            if (!initTriggered){
                maybeSyncList(areaName, OPTION_NO_SKIP_PARAMETERS_LIST, noSkipParametersList);
            }
        }

        if (changes[OPTION_NO_SKIP_URLS_LIST]) {
            updateNoSkipUrlsList(changes[OPTION_NO_SKIP_URLS_LIST].newValue);
            if (!initTriggered){
                maybeSyncList(areaName, OPTION_NO_SKIP_URLS_LIST, noSkipUrlsList);
            }
        }

        if (changes[OPTION_SKIP_URLS_LIST]) {
            updateSkipUrlsList(changes[OPTION_SKIP_URLS_LIST].newValue);
            if (!initTriggered){
                maybeSyncList(areaName, OPTION_SKIP_URLS_LIST, skipUrlsList);
            }
        }

        if (changes[OPTION_MODE]) {
            currentMode = changes[OPTION_MODE].newValue;
        }

        if (currentMode === OPTION_MODE_OFF) {
            disableSkipping();
        } else {
            enableSkipping();
        }

        if (changes[OPTION_INDICATOR_ENABLED]) {
            indicatorEnabled = changes[OPTION_INDICATOR_ENABLED].newValue;
        }

        if (changes[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN]) {
            skipRedirectsToSameDomain = changes[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN].newValue;
        }

    }
);

browser.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        if (sender.tab) {
            switch(message.id) {
                case "badgeCounter":
                    updateBadge(sender.tab.id, ! message.badgeCounter ? "" : message.badgeCounter < 100 ? message.badgeCounter : "+99");
                    break;
                case "getRedirectURLs":
                    sendResponse(getRedirectURLs(message.urls));
                    break;
            }
        }

        return false;
    }
);

browser.webRequest.onCompleted.addListener(
    (details) => {
        browser.tabs.sendMessage(details.tab.id, {id: "xhrRequestCompleted"})
    },
    {urls: ['*://*/*'], types: ["xmlhttprequest"]}
);

function updateNoSkipParametersList(newNoSkipParametersList) {
    noSkipParametersList = newNoSkipParametersList.filter(Boolean);
}

function updateNoSkipUrlsList(newNoSkipUrlsList) {
    noSkipUrlsList = newNoSkipUrlsList.filter(Boolean);
}

function updateSkipUrlsList(newSkipUrlsList) {
    skipUrlsList = newSkipUrlsList.filter(Boolean);
}

function initSyncLists() {
    Promise.all([
        browser.storage.local.get(LIST_OPTIONS),
        browser.storage.sync.get(LIST_OPTIONS),
    ])
        .then(
            ([localResult, remoteResult]) => {
                LIST_OPTIONS.forEach((optionName) => {
                    const localValue = localResult[optionName];
                    const remoteValue = remoteResult[optionName];
                    const newValue = util.mergeList(localValue, remoteValue);

                    if (JSON.stringify(localValue) != JSON.stringify(newValue)) {
                        browser.storage.local.set({[optionName]: newValue});
                    }
                    if (JSON.stringify(remoteValue) != JSON.stringify(newValue)) {
                        browser.storage.sync.set({[optionName]: newValue});
                    }
                });
            }
        );
}

function maybeSyncList(changedArea, optionName, optionValue) {
    if (!syncLists) {
        return;
    }

    const toAreaName = changedArea === "local" ? "sync" : "local";
    const toArea = browser.storage[toAreaName];

    toArea.get([optionName]).then(
        (result) => {
            const targetValue = result[optionName];
            if (JSON.stringify(targetValue) !== JSON.stringify(optionValue)){
                toArea.set({[optionName]: optionValue});
            }
        }
    );
}

function enableSkipping() {
    let path = "";
    if (currentMode === OPTION_MODE_NO_SKIP_URLS_LIST) {
        path = ICON_NO_SKIP_URLS_LIST;
    } else if (currentMode === OPTION_MODE_SKIP_URLS_LIST) {
        path = ICON_SKIP_URLS_LIST;
    }

    updateIcon(browser.i18n.getMessage("actionLabelOn"), path);
}

function disableSkipping() {
    updateIcon(browser.i18n.getMessage("actionLabelOff"), ICON_OFF);
}

function updateIcon(title, path) {
    if (path) {
        browser.action.setIcon({path: {
            16: '/icons/' + path + '/16.png',
            32: '/icons/' + path + '/32.png',
            48: '/icons/' + path + '/48.png',
            64: '/icons/' + path + '/64.png'
        }});
    }
    browser.action.setTitle({title: title});
};

function getRedirectURLs(originUrls) {
    if (currentMode == OPTION_MODE_OFF) {
        return {};
    }

    const parameterExceptions = noSkipParametersList;
    let urlExceptions = [];
    if (currentMode === OPTION_MODE_NO_SKIP_URLS_LIST) {
        urlExceptions = noSkipUrlsList;
    }

    let redirectUrls = {};
    for (const originUrl in originUrls) {
        redirectUrls[originUrl] = url.getRedirectTarget(originUrl, urlExceptions, parameterExceptions);

        if (currentMode === OPTION_MODE_NO_SKIP_URLS_LIST && !skipRedirectsToSameDomain) {
            const sourceHostname = new URL(originUrl).hostname;
            const targetHostname = new URL(redirectUrls[originUrl]).hostname;
            const sourceDomain = psl.getDomain(sourceHostname);
            const targetDomain = psl.getDomain(targetHostname);
            if (sourceDomain === targetDomain) {
                delete redirectUrls[originUrl];
            }
        }

        if (redirectUrls[originUrl] == originUrl) {
            delete redirectUrls[originUrl];
        }
    }

    return (redirectUrls);
}

function updateBadge(tabId, text) {
    chrome.action.setBadgeText({tabId: parseInt(tabId), text: text + ""});
}


function chainPromises(functions) {
    let promise = Promise.resolve();
    for (const function_ of functions) {
        promise = promise.then(function_);
    }

    return promise.catch((error) => { console.warn(error.message); });
}
