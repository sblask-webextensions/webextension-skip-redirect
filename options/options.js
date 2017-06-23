function restoreOptions() {
    browser.storage.local.get([
        "mode",
        "blacklist",
        "whitelist",
        "notificationPopupEnabled",
        "notificationDuration",
    ]).then(
        result => {
            document.querySelector("#blacklist").value = result.blacklist.join("\n");
            document.querySelector("#whitelist").value = result.whitelist.join("\n");
            document.querySelector("#mode" + result.mode.charAt(0).toUpperCase() + result.mode.slice(1)).checked = "checked";
            document.querySelector("#notificationPopupEnabled").checked = result.notificationPopupEnabled;
            document.querySelector("#notificationDuration").value = result.notificationDuration;
        }
    );
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
document.querySelector("form").addEventListener("submit", saveOptions);

browser.storage.onChanged.addListener(restoreOptions);
