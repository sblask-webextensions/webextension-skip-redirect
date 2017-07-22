function restoreOptions() {
    browser.storage.local.get([
        "mode",
        "blacklist",
        "whitelist",
        "notificationPopupEnabled",
        "notificationDuration",
    ]).then(
        result => {
            setTextValue("blacklist", result.blacklist.join("\n"));
            setTextValue("whitelist", result.whitelist.join("\n"));
            setBooleanValue("mode" + result.mode.charAt(0).toUpperCase() + result.mode.slice(1), true);
            setBooleanValue("notificationPopupEnabled", result.notificationPopupEnabled);
            setTextValue("notificationDuration", result.notificationDuration);
        }
    );
}

function enableAutosave() {
    for (let input of document.querySelectorAll("input:not([type=radio]):not([type=checkbox]), textarea")) {
        input.addEventListener("input", saveOptions);
    }
    for (let input of document.querySelectorAll("input[type=radio], input[type=checkbox]")) {
        input.addEventListener("change", saveOptions);
    }
}

function loadTranslations() {
    for (let element of document.querySelectorAll("[data-i18n]")) {
        let translationKey = element.getAttribute("data-i18n");
        if (typeof browser === "undefined" || !browser.i18n.getMessage(translationKey)) {
            element.textContent = element.getAttribute("data-i18n");
        } else {
            element.innerHTML = browser.i18n.getMessage(translationKey);
        }
    }
}

function setTextValue(elementID, newValue) {
    let oldValue = document.getElementById(elementID).value;

    if (oldValue !== newValue) {
        document.getElementById(elementID).value = newValue;
    }
}

function setBooleanValue(elementID, newValue) {
    document.getElementById(elementID).checked = newValue;
}

function saveOptions(event) {
    event.preventDefault();
    browser.storage.local.set({
        blacklist: document.querySelector("#blacklist").value.split("\n"),
        whitelist: document.querySelector("#whitelist").value.split("\n"),
        mode: document.querySelector("#modeOff").checked && "off"
              ||
              document.querySelector("#modeBlacklist").checked && "blacklist"
              ||
              document.querySelector("#modeWhitelist").checked && "whitelist",
        notificationPopupEnabled: document.querySelector("#notificationPopupEnabled").checked,
        notificationDuration: document.querySelector("#notificationDuration").value,
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", enableAutosave);
document.addEventListener("DOMContentLoaded", loadTranslations);
document.querySelector("form").addEventListener("submit", saveOptions);

browser.storage.onChanged.addListener(restoreOptions);
