var EXCEPTIONS = [
    "abp",
    "account",
    "auth",
    "download",
    "login",
    "logout",
    "register",
    "signin",
    "signoff",
    "signon",
    "signout",
    "signup",
    "subscribe",
];

var PROTOCOLS = [
    "ftp",
    "http",
    "https",
    "mms",
    "rtsp",
];

var protocolsGroup = "(?:" + PROTOCOLS.join("|") + ")";
var colonGroup = "(:|%3A|%253A)";

function maybeDecode(urlMatch, colonMatch) {
    switch(colonMatch) {
        case "%253A":
            return decodeURIComponent(decodeURIComponent(urlMatch));
        case "%3A":
            return decodeURIComponent(urlMatch);
        case ":":
            return urlMatch;
    }
}

function getRedirectTarget(url) {
    if (new RegExp("(" + EXCEPTIONS.join("|") + ")").test(url)) {
        return undefined;
    }

    let simpleMatchString = "(?:\\?|/)" + "(" + protocolsGroup + colonGroup + ".*$" + ")";
    let simpleMatches = url.match(new RegExp(simpleMatchString), "i");
    if (simpleMatches) {
        let [urlMatch, colonMatch] = simpleMatches.splice(1, 2);
        return maybeDecode(urlMatch, colonMatch);
    }

    let queryMatchString = "=" + "(" + protocolsGroup + colonGroup + "[^?&;#]*" + ")";
    let queryMatches = url.match(new RegExp(queryMatchString), "i");
    if (queryMatches) {
        let [urlMatch, colonMatch] = queryMatches.splice(1, 2);
        return maybeDecode(urlMatch, colonMatch);
    }

    return undefined;
}

exports.getRedirectTarget = getRedirectTarget;
