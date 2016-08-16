const base64 = require("sdk/base64");
const simplePreferences = require("sdk/simple-prefs");

const GLOBAL_EXCEPTIONS = [
    "abp",
    "account",
    "auth",
    "cookie",
    "download",
    "login",
    "logout",
    "preferences",
    "profile",
    "register",
    "signin",
    "signoff",
    "signon",
    "signout",
    "signup",
    "subscribe",
    "verification",
    "\/\/web\.archive\.org\/web\/",
    "\/\/archive\.is\/",
    "\/\/www\.webcitation\.org\/",
    "\/\/webarchive\.nationalarchives\.gov\.uk\/",
    "\/\/www\.webcitation\.org\/",
    "\/\/archive\.wikiwix\.com\/",
    "\/\/www\.webarchive\.org\.uk\/"
].join("|");

const PROTOCOLS = [
    "ftp",
    "http",
    "https",
    "mms",
    "rtsp",
];

function comprehend(array, transformFunction) {
    const result = [];
    for (let thing of array) {
        result.push(transformFunction(thing));
    }

    return result;
}

const possibleColonPrefixes = comprehend(PROTOCOLS, protocol => protocol + "(?::)").concat("www\\.");
const possibleColonPrefixesString = "(?:" + possibleColonPrefixes.join("|") + ")";

const possibleEncodedColonPrefixes = comprehend(PROTOCOLS, protocol => protocol + "(?:%3A|%253A)").concat("www\\.");
const possibleEncodedColonPrefixesString = "(?:" + possibleEncodedColonPrefixes.join("|") + ")";

const possiblePlainPrefixes = comprehend(PROTOCOLS, protocol => protocol + "(?::|%3A|%253A)").concat("www\\.");
const possiblePlainPrefixesString = "(?:" + possiblePlainPrefixes.join("|") + ")";

const possibleBase64Prefixes =        comprehend(PROTOCOLS, protocol =>  base64.encode(protocol + "://").slice(0, -4)).concat(base64.encode("www"));
const possibleBase64PrefixesDecoded = comprehend(PROTOCOLS, protocol =>                protocol + "://")              .concat("www\\.");
const possibleBase64PrefixesString = "(?:" + possibleBase64Prefixes.join("|") + ")";

// the slice above is required in case there is padding, that's why a test on
// the decoded string is needed
const base64CheckRegexp = new RegExp("^(?:" + possibleBase64PrefixesDecoded.join("|") + ")", "i");

const pathRegexpPlainProtocol   = new RegExp("https?://.*" + "(?:\\?|/)" + "(" + possibleColonPrefixesString         + ".*$"                                                                 + ")", "i");
const pathRegexpEncodedProtocol = new RegExp("https?://.*" + "(?:\\?|/)" + "(" + possibleEncodedColonPrefixesString  + "[^?&;#]*"                                                            + ")", "i");
const pathRegexpBase64Protocol  = new RegExp("https?://.*" + "(?:\\?|/)" + "(" + possibleBase64PrefixesString        + "[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/]+" + ")", "i");

// the first alternative in the group is for the case that there are several ?
// in the url and thus encoding is incomplete - it just picks everything from
// there to the end or the next ?
const queryRegexpPlainProtocol  = new RegExp("https?://.*" +         "=" + "(" + possiblePlainPrefixesString  + "(?:[^?&;#]*[?][^?]*|[^?&;#]*)" +                                       ")", "i");
const queryRegexpBase64Protocol = new RegExp("https?://.*" +         "=" + "(" + possibleBase64PrefixesString + "[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/]+" + ")", "i");

// %
const percentRegExp = new RegExp("%25", "i");

// #$&+,/:;=?@
const symbolRegExp = new RegExp("(%23|%24|%26|%2B|%2C|%2F|%3A|%3B|%3D|%3F|%40)", "i");

function maybeDecode(urlMatch) {
    if (percentRegExp.test(urlMatch)) {
        urlMatch = decodeURIComponent(urlMatch);
    }

    if (symbolRegExp.test(urlMatch, "i")) {
        urlMatch = decodeURIComponent(urlMatch);
    }

    if (urlMatch.indexOf("http") !== 0) {
        urlMatch = "http://" + urlMatch;
    }

    return urlMatch;
}

function getCustomExceptions() {
    const preferences = simplePreferences.prefs;
    let exceptions = preferences.exceptions;
    if (exceptions.length !== 0) {
        exceptions = "|" + exceptions;
    }

    return exceptions;
}

function getPlainMatches(url) {
    const matches =
        url.match(pathRegexpPlainProtocol, "i") ||
        url.match(pathRegexpEncodedProtocol, "i") ||
        url.match(queryRegexpPlainProtocol, "i") ||
        undefined;
    if (matches) {
        return matches[1];
    }
}

function getBase64Matches(url) {
    const matches =
        url.match(pathRegexpBase64Protocol, "i") ||
        url.match(queryRegexpBase64Protocol, "i") ||
        undefined;
    if (matches) {
        const decodedMatch = base64.decode(matches[1]);
        if (base64CheckRegexp.test(decodedMatch, "i")) {
            return decodedMatch;
        }
    }
}

function getRedirectTarget(url) {
    if (new RegExp("(" + GLOBAL_EXCEPTIONS + getCustomExceptions() + ")").test(url)) {
        return url;
    }

    const extractedUrl = getPlainMatches(url) || getBase64Matches(url);
    if (extractedUrl) {
        return getRedirectTarget(maybeDecode(extractedUrl));
    }

    return url;
}

exports.getRedirectTarget = getRedirectTarget;
