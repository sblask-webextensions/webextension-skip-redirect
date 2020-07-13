function copyToClipboard(text) { // eslint-disable-line no-unused-vars
    const copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;

    document.body.appendChild(copyFrom);
    copyFrom.select();
    copyFrom.focus();
    document.execCommand("Copy");
    document.body.removeChild(copyFrom);
}
