const OPTION_MODE = "mode";

const OPTION_MODE_OFF = "off";
const OPTION_MODE_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_MODE_SKIP_URLS_LIST = "whitelist";

const OPTION_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_SKIP_URLS_LIST = "whitelist";

const OPTION_NOTIFICATION_POPUP_ENABLED = "notificationPopupEnabled";
const OPTION_NOTIFICATION_DURATION = "notificationDuration";

const OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN = "skipRedirectsToSameDomain";

const ELEMENT_MODE_OFF = "mode-off";
const ELEMENT_MODE_NO_SKIP_URLS_LIST = "mode-no-skip-urls-list";
const ELEMENT_MODE_SKIP_URLS_LIST = "mode-skip-urls-list";

const ELEMENT_NO_SKIP_URLS_LIST = "no-skip-urls-list";
const ELEMENT_NO_SKIP_URLS_LIST_ERROR = "no-skip-urls-list-error";
const ELEMENT_SKIP_URLS_LIST = "skip-urls-list";
const ELEMENT_NOTIFICATION_POPUP_ENABLED = "notification-popup-eneabled";
const ELEMENT_NOTIFICATION_DURATION = "notification-duration";
const ELEMENT_SKIP_REDIRECTS_TO_SAME_DOMAIN = "skipRedirectsToSameDomain";

function restoreOptions() {
    browser.storage.local.get([
        OPTION_MODE,
        OPTION_NO_SKIP_URLS_LIST,
        OPTION_SKIP_URLS_LIST,
        OPTION_NOTIFICATION_POPUP_ENABLED,
        OPTION_NOTIFICATION_DURATION,
        OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN,
    ]).then(
        result => {
            const noSkipUrlsList = result[OPTION_NO_SKIP_URLS_LIST];
            maybeHighlightError(noSkipUrlsList);

            setTextValue(ELEMENT_NO_SKIP_URLS_LIST, noSkipUrlsList.join("\n"));
            setTextValue(ELEMENT_SKIP_URLS_LIST, result[OPTION_SKIP_URLS_LIST].join("\n"));
            setBooleanValue(ELEMENT_NOTIFICATION_POPUP_ENABLED, result[OPTION_NOTIFICATION_POPUP_ENABLED]);
            setTextValue(ELEMENT_NOTIFICATION_DURATION, result[OPTION_NOTIFICATION_DURATION]);
            setBooleanValue(ELEMENT_SKIP_REDIRECTS_TO_SAME_DOMAIN, result[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN]);

            switch (result[OPTION_MODE]) {
                case OPTION_MODE_OFF:
                    setBooleanValue(ELEMENT_MODE_OFF, true);
                    break;
                case OPTION_MODE_NO_SKIP_URLS_LIST:
                    setBooleanValue(ELEMENT_MODE_NO_SKIP_URLS_LIST, true);
                    break;
                case OPTION_MODE_SKIP_URLS_LIST:
                    setBooleanValue(ELEMENT_MODE_SKIP_URLS_LIST, true);
                    break;
            }
        }
    );
}

function enableAutosave() {
    for (const input of document.querySelectorAll("input:not([type=radio]):not([type=checkbox]), textarea")) {
        input.addEventListener("input", saveOptions);
    }
    for (const input of document.querySelectorAll("input[type=radio], input[type=checkbox]")) {
        input.addEventListener("change", saveOptions);
    }
}

function loadTranslations() {
    for (const element of document.querySelectorAll("[data-i18n]")) {
        const translationKey = element.getAttribute("data-i18n");
        if (typeof browser === "undefined" || !browser.i18n.getMessage(translationKey)) {
            element.textContent = element.getAttribute("data-i18n");
        } else {
            element.innerHTML = browser.i18n.getMessage(translationKey);
        }
    }
}

function setTextValue(elementID, newValue) {
    const oldValue = document.getElementById(elementID).value;

    if (oldValue !== newValue) {
        document.getElementById(elementID).value = newValue;
    }
}

function setBooleanValue(elementID, newValue) {
    document.getElementById(elementID).checked = newValue;
}

function getRegExpError(noSkipUrlsList) {
    for(const line of noSkipUrlsList) {
        try {
            new RegExp(line);
        } catch(exception) {
            return {
                line,
                message: exception.message,
            };
        }
    }
    return null;
}

function maybeHighlightError(noSkipUrlsList) {
    const noSkipUrlsListElement = document.querySelector(`#${ELEMENT_NO_SKIP_URLS_LIST}`);
    const noSkipUrlsListErrorSpan = document.querySelector(`#${ELEMENT_NO_SKIP_URLS_LIST_ERROR}`);
    const noSkipUrlsListError = getRegExpError(noSkipUrlsList);
    if (noSkipUrlsListError) {
        const {line, message} = noSkipUrlsListError;
        noSkipUrlsListElement.classList.add("error");

        if (message.includes(line)) {
            noSkipUrlsListErrorSpan.innerText = message;
        } else {
            noSkipUrlsListErrorSpan.innerText = `${line}: ${message}`;
        }
    } else {
        noSkipUrlsListElement.classList.remove("error");
        noSkipUrlsListErrorSpan.innerText = "";
    }
}

function saveOptions(event) {
    event.preventDefault();
    const noSkipUrlsList = document.querySelector(`#${ELEMENT_NO_SKIP_URLS_LIST}`).value.split("\n");

    maybeHighlightError(noSkipUrlsList);

    browser.storage.local.set({
        [OPTION_NO_SKIP_URLS_LIST]: noSkipUrlsList,
        [OPTION_SKIP_URLS_LIST]: document.querySelector(`#${ELEMENT_SKIP_URLS_LIST}`).value.split("\n"),
        [OPTION_MODE]:
            document.querySelector(`#${ELEMENT_MODE_OFF}`).checked && OPTION_MODE_OFF
            ||
            document.querySelector(`#${ELEMENT_MODE_NO_SKIP_URLS_LIST}`).checked && OPTION_MODE_NO_SKIP_URLS_LIST
            ||
            document.querySelector(`#${ELEMENT_MODE_SKIP_URLS_LIST}`).checked && OPTION_MODE_SKIP_URLS_LIST,
        [OPTION_NOTIFICATION_POPUP_ENABLED]: document.querySelector(`#${ELEMENT_NOTIFICATION_POPUP_ENABLED}`).checked,
        [OPTION_NOTIFICATION_DURATION]: document.querySelector(`#${ELEMENT_NOTIFICATION_DURATION}`).value,
        [OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN]: document.querySelector(`#${ELEMENT_SKIP_REDIRECTS_TO_SAME_DOMAIN}`).checked,
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", enableAutosave);
document.addEventListener("DOMContentLoaded", loadTranslations);
document.querySelector("form").addEventListener("submit", saveOptions);

browser.storage.onChanged.addListener(restoreOptions);
