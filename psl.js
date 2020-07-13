/* global pslrules */
const psl = (function(root) { //  eslint-disable-line no-unused-vars

    if (typeof pslrules === "undefined") {
        pslrules = require("./pslrules"); //  eslint-disable-line no-global-assign,no-unused-vars
    }

    function getDomain(hostname, previousHead=undefined) {
        if (!hostname) {
            return undefined;
        }

        if (pslrules.EXCEPTION_ENTRIES.has(hostname)) {
            return hostname;
        }

        const dotIndex = hostname.indexOf(".");
        if (dotIndex == -1) {
            return undefined;
        }

        const head = hostname.slice(0, dotIndex);
        const rest = hostname.slice(dotIndex + 1);

        if (pslrules.WILDCARD_ENTRIES.has(rest) && previousHead) {
            return [previousHead, head, rest].join(".");
        }
        if (pslrules.NORMAL_ENTRIES.has(rest)) {
            return [head, rest].join(".");
        }

        return getDomain(rest, head);
    }

    root.getDomain = getDomain;

    return {
        getDomain: getDomain,
    };

})(this);
