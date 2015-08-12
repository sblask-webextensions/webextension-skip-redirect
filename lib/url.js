const simplePreferences = require('sdk/simple-prefs');

var EXCEPTIONS = [
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
];

var PROTOCOLS = [
    "ftp",
    "http",
    "https",
    "mms",
    "rtsp",
];

var protocolsGroup = "(?:" + PROTOCOLS.join("|") + ")";
var colonGroup = "(?::|%3A|%253A)";
var protocol = protocolsGroup + colonGroup;

var pathRegexpProtocol                    = new RegExp("https?://.*" + "(?:\\?|/)" + "(" + protocol + ".*$" + ")");
var pathRegexpWWW                         = new RegExp("https?://.*" + "(?:\\?|/)" + "(" + "www\\." + ".*$" + ")");
var queryRegexpProtocolIncompleteEncoding = new RegExp("https?://.*" +         "=" + "(" + protocol + "[^?&;#]*[?][^?]*" + ")");
var queryRegexpWWWIncompleteEncoding      = new RegExp("https?://.*" +         "=" + "(" + "www\\." + "[^?&;#]*[?][^?]*" + ")");
var queryRegexpProtocol                   = new RegExp("https?://.*" +         "=" + "(" + protocol + "[^?&;#]*" + ")");
var queryRegexpWWW                        = new RegExp("https?://.*" +         "=" + "(" + "www\\." + "[^?&;#]*" + ")");

function maybeDecode(urlMatch) {
    // %
    if (new RegExp("%25").test(urlMatch)) {
        urlMatch = decodeURIComponent(urlMatch);
    }
    // #$&+,/:;=?@
    if (new RegExp("(%23|%24|%26|%2B|%2C|%2F|%3A|%3B|%3D|%3F|%40)").test(urlMatch)) {
        urlMatch = decodeURIComponent(urlMatch);
    }
    if (urlMatch.indexOf("http") !== 0) {
        urlMatch = "http://" + urlMatch;
    }
    return urlMatch;
}

function getExceptionString() {
    let exceptions = simplePreferences.prefs.exceptions;
    if (exceptions.length !== 0) {
        exceptions = "|" + exceptions;
    }
    return exceptions;
}

function getRedirectTarget(url) {
    if (new RegExp("(" + EXCEPTIONS.join("|") + getExceptionString() + ")").test(url)) {
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
