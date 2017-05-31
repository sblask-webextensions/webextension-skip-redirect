function restoreOptions() {
    browser.storage.local.get([
        "mode",
        "blacklist",
        "whitelist",
    ], result => {
        document.querySelector("#blacklist").value = result.blacklist.join("\n");
        document.querySelector("#whitelist").value = result.whitelist.join("\n");
        document.querySelector("#mode" + result.mode.charAt(0).toUpperCase() + result.mode.slice(1)).checked = "checked";
    });
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
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

browser.storage.onChanged.addListener(restoreOptions);
