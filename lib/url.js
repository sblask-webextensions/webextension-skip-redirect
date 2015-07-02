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

function getRedirectTarget(url) {
    if (new RegExp("(" + EXCEPTIONS.join("|") + ")").test(url)) {
        return undefined;
    }

    var matchString = "=" + "(" + protocolsGroup + colonGroup + "[^?&;#]*" + ")";
    var matches = url.match(new RegExp(matchString), "i");
    if (matches) {
        var [urlMatch, colonMatch] = matches.splice(1, 2);
        switch(colonMatch) {
            case "%253A":
                return decodeURIComponent(decodeURIComponent(urlMatch));
            case "%3A":
                return decodeURIComponent(urlMatch);
            default:
                return urlMatch;
        }
    }
    return undefined;
}

exports.getRedirectTarget = getRedirectTarget;
