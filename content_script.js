const DATA_HREF = chrome.runtime.getManifest().name.replaceAll(" ", "_").toLowerCase() + "_href";
const DATA_CHECKED = chrome.runtime.getManifest().name.replaceAll(" ", "_").toLowerCase() + "_checked";

const UPDATE_MODE_CHECK_ALL = "all";
const UPDATE_MODE_CHECK_UNCHECKED = "unchecked";

const OPTION_INDICATOR_ENABLED = "indicatorEnabled";

let indicatorEnabled = true;
let contentLoaded = false;

function replaceURLsInDocument(updateMode, redirectUrls) {

    const replaceURLsInLinks = function (doc) {
        let urls = {};
        let badgeCounter = 0;

        for (const element of [...doc.getElementsByTagName("a")]) {
            let url = "";
            if (element.dataset[DATA_HREF]) {
                url = new URL(element.dataset[DATA_HREF], doc.URL).href;
            } else {
                url = new URL(element.href, doc.URL).href;
            }

            if (updateMode == UPDATE_MODE_CHECK_ALL) {
                if (element.dataset[DATA_HREF]) {
                    element.href = element.dataset[DATA_HREF];
                    element.classList.remove("skip-redirect-indicator");
                    delete element.dataset[DATA_HREF];
                }
                delete element.dataset[DATA_CHECKED];
            }

            if (! redirectUrls) {
                if (! element.dataset[DATA_CHECKED]) {
                    urls[url] = element.href;
                    element.dataset[DATA_CHECKED] = "true";
                }
            } else {
                if (redirectUrls[url] && ! element.dataset[DATA_HREF]) {
                    element.dataset[DATA_HREF] = element.href;
                    element.href = redirectUrls[url];
                    if (indicatorEnabled) {
                        element.classList.add("skip-redirect-indicator");
                    }
                }

                if (element.dataset[DATA_HREF]) {
                    badgeCounter++;
                }
            }
        }

        // HTML <iframe ...
        for (const iframe in [...doc.getElementsByTagName("iframe")]) {
            if (iframe.contentDocument) {
                if (! redirectUrls) {
                    urls = {...urls, ...replaceURLsInLinks(iframe.contentDocument)};
                } else {
                    badgeCounter += replaceURLsInLinks(iframe.contentDocument);
                }
            }
        };

        if (! redirectUrls) {
            return urls;
        } else {
            return badgeCounter;
        }
    }
    
    return replaceURLsInLinks(document);
}

function replaceURLs(updateMode) {
    const urls = replaceURLsInDocument(updateMode);
    if (Object.keys(urls).length) {
        chrome.runtime.sendMessage({id: "getRedirectURLs", urls: urls})
            .then((redirectUrls) => {
                const badgeCounter = replaceURLsInDocument(updateMode, redirectUrls);
                chrome.runtime.sendMessage({id: "badgeCounter", badgeCounter: badgeCounter});
            });
    }
}

chrome.storage.local.get(
    [
        OPTION_INDICATOR_ENABLED,
    ],
    (result) => {

        if (result[OPTION_INDICATOR_ENABLED] === undefined) {
            chrome.storage.local.set({[OPTION_INDICATOR_ENABLED]: true});
        } else {
            indicatorEnabled = result[OPTION_INDICATOR_ENABLED];
            replaceURLs(1, UPDATE_MODE_CHECK_ALL);
        }

    }
);

chrome.storage.onChanged.addListener(
    (changes, areaName) => {

        if (changes[OPTION_INDICATOR_ENABLED]) {
            indicatorEnabled = changes[OPTION_INDICATOR_ENABLED].newValue;
            if (changes[OPTION_INDICATOR_ENABLED].oldValue != indicatorEnabled) {
                replaceURLs(UPDATE_MODE_CHECK_ALL);
            }
        }

    }
);

chrome.runtime.onMessage.addListener(function (message) {
    if (message.id == "xhrRequestCompleted") {
        replaceURLs(UPDATE_MODE_CHECK_UNCHECKED);
    }
});

document.addEventListener("DOMContentLoaded", function (e) {
    contentLoaded = true;
});

function loadingHandler() {
    replaceURLs(4, UPDATE_MODE_CHECK_UNCHECKED);

    if (! contentLoaded) {
        setTimeout(loadingHandler, 100);
    }
};
loadingHandler();
