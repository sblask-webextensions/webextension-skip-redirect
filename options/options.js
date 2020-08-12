const OPTION_MODE = "mode";

const OPTION_MODE_OFF = "off";
const OPTION_MODE_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_MODE_SKIP_URLS_LIST = "whitelist";

const OPTION_NO_SKIP_PARAMETERS_LIST = "no-skip-parameters-list";
const OPTION_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_SKIP_URLS_LIST = "whitelist";
const OPTION_SYNC_LISTS_ENABLED = "syncListsEnabled";

const OPTION_NOTIFICATION_POPUP_ENABLED = "notificationPopupEnabled";
const OPTION_NOTIFICATION_DURATION = "notificationDuration";

const OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN = "skipRedirectsToSameDomain";

const ELEMENT_MODE_OFF = "mode-off";
const ELEMENT_MODE_NO_SKIP_URLS_LIST = "mode-no-skip-urls-list";
const ELEMENT_MODE_SKIP_URLS_LIST = "mode-skip-urls-list";

const ELEMENT_NO_SKIP_PARAMETERS_LIST = "no-skip-parameters-list";
const ELEMENT_NO_SKIP_URLS_LIST = "no-skip-urls-list";
const ELEMENT_SKIP_URLS_LIST = "skip-urls-list";
const ELEMENT_SYNC_LISTS_ENABLED = "sync-lists-enabled";

const ELEMENT_NO_SKIP_PARAMETERS_LIST_ERROR = "no-skip-parameters-list-error";
const ELEMENT_NO_SKIP_URLS_LIST_ERROR = "no-skip-urls-list-error";

const ELEMENT_NOTIFICATION_DURATION = "notification-duration";
const ELEMENT_NOTIFICATION_POPUP_ENABLED = "notification-popup-enabled";
const ELEMENT_SKIP_REDIRECTS_TO_SAME_DOMAIN = "skipRedirectsToSameDomain";


let timeout;


function restoreOptions() {
    browser.storage.local.get([
        OPTION_MODE,
        OPTION_NOTIFICATION_DURATION,
        OPTION_NOTIFICATION_POPUP_ENABLED,
        OPTION_NO_SKIP_PARAMETERS_LIST,
        OPTION_NO_SKIP_URLS_LIST,
        OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN,
        OPTION_SKIP_URLS_LIST,
        OPTION_SYNC_LISTS_ENABLED,
    ]).then(
        result => {
            const noSkipUrlsList = result[OPTION_NO_SKIP_URLS_LIST];
            maybeHighlightError(noSkipUrlsList, ELEMENT_NO_SKIP_URLS_LIST, ELEMENT_NO_SKIP_URLS_LIST_ERROR);
            setTextValue(ELEMENT_NO_SKIP_URLS_LIST, noSkipUrlsList.join("\n"));

            const noSkipParametersList = result[OPTION_NO_SKIP_PARAMETERS_LIST];
            maybeHighlightError(noSkipParametersList, ELEMENT_NO_SKIP_PARAMETERS_LIST, ELEMENT_NO_SKIP_PARAMETERS_LIST_ERROR);
            setTextValue(ELEMENT_NO_SKIP_PARAMETERS_LIST, noSkipParametersList.join("\n"));

            setBooleanValue(ELEMENT_NOTIFICATION_POPUP_ENABLED, result[OPTION_NOTIFICATION_POPUP_ENABLED]);
            setBooleanValue(ELEMENT_SKIP_REDIRECTS_TO_SAME_DOMAIN, result[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN]);
            setBooleanValue(ELEMENT_SYNC_LISTS_ENABLED, result[OPTION_SYNC_LISTS_ENABLED]);

            setTextValue(ELEMENT_NOTIFICATION_DURATION, result[OPTION_NOTIFICATION_DURATION]);
            setTextValue(ELEMENT_SKIP_URLS_LIST, result[OPTION_SKIP_URLS_LIST].join("\n"));

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
        input.addEventListener("input", delayedSaveOptions);
    }
    for (const input of document.querySelectorAll("input[type=radio], input[type=checkbox]")) {
        input.addEventListener("change", delayedSaveOptions);
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

function maybeHighlightError(list, listElementId, errorElementId) {
    const listElement = document.querySelector(`#${listElementId}`);
    const errorElement = document.querySelector(`#${errorElementId}`);
    const error = getRegExpError(list);
    if (error) {
        const {line, message} = error;
        listElement.classList.add("error");

        if (message.includes(line)) {
            errorElement.innerText = message;
        } else {
            errorElement.innerText = `${line}: ${message}`;
        }
    } else {
        listElement.classList.remove("error");
        errorElement.innerText = "";
    }
}

function delayedSaveOptions(event) {
    clearTimeout(timeout);
    timeout = setTimeout(saveOptions, 1000, event);
}

function saveOptions(event) {
    event.preventDefault();

    const noSkipUrlsList = document.querySelector(`#${ELEMENT_NO_SKIP_URLS_LIST}`).value.split("\n");
    maybeHighlightError(noSkipUrlsList, ELEMENT_NO_SKIP_URLS_LIST, ELEMENT_NO_SKIP_URLS_LIST_ERROR);

    const noSkipParametersList = document.querySelector(`#${ELEMENT_NO_SKIP_PARAMETERS_LIST}`).value.split("\n");
    maybeHighlightError(noSkipParametersList, ELEMENT_NO_SKIP_PARAMETERS_LIST, ELEMENT_NO_SKIP_PARAMETERS_LIST_ERROR);

    browser.storage.local.set({

        [OPTION_NO_SKIP_URLS_LIST]: noSkipUrlsList,
        [OPTION_NO_SKIP_PARAMETERS_LIST]: noSkipParametersList,
        [OPTION_SKIP_URLS_LIST]: document.querySelector(`#${ELEMENT_SKIP_URLS_LIST}`).value.split("\n"),

        [OPTION_MODE]:
            document.querySelector(`#${ELEMENT_MODE_OFF}`).checked && OPTION_MODE_OFF
            ||
            document.querySelector(`#${ELEMENT_MODE_NO_SKIP_URLS_LIST}`).checked && OPTION_MODE_NO_SKIP_URLS_LIST
            ||
            document.querySelector(`#${ELEMENT_MODE_SKIP_URLS_LIST}`).checked && OPTION_MODE_SKIP_URLS_LIST,

        [OPTION_NOTIFICATION_DURATION]: document.querySelector(`#${ELEMENT_NOTIFICATION_DURATION}`).value,
        [OPTION_NOTIFICATION_POPUP_ENABLED]: document.querySelector(`#${ELEMENT_NOTIFICATION_POPUP_ENABLED}`).checked,
        [OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN]: document.querySelector(`#${ELEMENT_SKIP_REDIRECTS_TO_SAME_DOMAIN}`).checked,
        [OPTION_SYNC_LISTS_ENABLED]: document.querySelector(`#${ELEMENT_SYNC_LISTS_ENABLED}`).checked,

    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", enableAutosave);
document.addEventListener("DOMContentLoaded", loadTranslations);
document.querySelector("form").addEventListener("submit", saveOptions);

browser.storage.onChanged.addListener(restoreOptions);
