const simplePreferences = require('sdk/simple-prefs');

const GLOBAL_EXCEPTIONS = [
    "abp",
    "account",
    "auth",
    "download",
    "login",
    "logout",
    "preferences",
    "register",
    "signin",
    "signoff",
    "signon",
    "signout",
    "signup",
    "subscribe",
    "verification",
].join("|");

const PROTOCOLS = [
    "ftp",
    "http",
    "https",
    "mms",
    "rtsp",
];

const protocolsGroup = "(?:" + PROTOCOLS.join("|") + ")";
const colonGroup = "(?::|%3A|%253A)";
const protocol = protocolsGroup + colonGroup;

const pathRegexpProtocol                    = new RegExp("https?://.*" + "(?:\\?|/)" + "(" + protocol + ".*$" + ")");
const pathRegexpWWW                         = new RegExp("https?://.*" + "(?:\\?|/)" + "(" + "www\\." + ".*$" + ")");
const queryRegexpProtocolIncompleteEncoding = new RegExp("https?://.*" +         "=" + "(" + protocol + "[^?&;#]*[?][^?]*" + ")");
const queryRegexpWWWIncompleteEncoding      = new RegExp("https?://.*" +         "=" + "(" + "www\\." + "[^?&;#]*[?][^?]*" + ")");
const queryRegexpProtocol                   = new RegExp("https?://.*" +         "=" + "(" + protocol + "[^?&;#]*" + ")");
const queryRegexpWWW                        = new RegExp("https?://.*" +         "=" + "(" + "www\\." + "[^?&;#]*" + ")");

// %
const percentRegExp = new RegExp("%25");
// #$&+,/:;=?@
const symbolRegExp = new RegExp("(%23|%24|%26|%2B|%2C|%2F|%3A|%3B|%3D|%3F|%40)");

function maybeDecode(urlMatch) {
    if (percentRegExp.test(urlMatch)) {
        urlMatch = decodeURIComponent(urlMatch);
    }
    if (symbolRegExp.test(urlMatch)) {
        urlMatch = decodeURIComponent(urlMatch);
    }
    if (urlMatch.indexOf("http") !== 0) {
        urlMatch = "http://" + urlMatch;
    }
    return urlMatch;
}

function getCustomExceptions() {
    let exceptions = simplePreferences.prefs.exceptions;
    if (exceptions.length !== 0) {
        exceptions = "|" + exceptions;
    }
    return exceptions;
}

function getRedirectTarget(url) {
    if (new RegExp("(" + GLOBAL_EXCEPTIONS + getCustomExceptions() + ")").test(url)) {
        return url;
    }

    let matches =
        url.match(queryRegexpProtocolIncompleteEncoding, "i") ||
        url.match(queryRegexpWWWIncompleteEncoding, "i") ||
        url.match(queryRegexpProtocol, "i") ||
        url.match(queryRegexpWWW, "i") ||
        url.match(pathRegexpProtocol, "i") ||
        url.match(pathRegexpWWW, "i") ||
        undefined;
    if (matches) {
        let urlMatch = matches[1];
        return maybeDecode(urlMatch);
    }
    return url;
}

exports.getRedirectTarget = getRedirectTarget;
