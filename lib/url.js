const base64 = require("sdk/base64");
const simplePreferences = require("sdk/simple-prefs");

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

function comprehend(array, transformFunction) {
    let result = [];
    for (let thing of array) {
        result.push(transformFunction(thing));
    }
    return result;
}

const colonGroup = "(?::|%3A|%253A)";
const possiblePlainPrefixes = comprehend(PROTOCOLS, protocol => protocol + colonGroup).concat("www\\.");
const possiblePlainPrefixesString = "(?:" + possiblePlainPrefixes.join("|") + ")";

const possibleBase64Prefixes =        comprehend(PROTOCOLS, protocol =>  base64.encode(protocol + "://").slice(0, -4)).concat(base64.encode("www"));
const possibleBase64PrefixesDecoded = comprehend(PROTOCOLS, protocol =>                protocol + "://"              ).concat(              "www\\.");
const possibleBase64PrefixesString = "(?:" + possibleBase64Prefixes.join("|") + ")";
// the slice above is required in case there is padding, that's why a test on
// the decoded string is needed
const base64CheckRegexp = new RegExp("^(?:" + possibleBase64PrefixesDecoded.join("|") + ")");

const pathRegexpPlainProtocol   = new RegExp("https?://.*" + "(?:\\?|/)" + "(" + possiblePlainPrefixesString  + ".*$"                                                                 + ")");
const pathRegexpBase64Protocol  = new RegExp("https?://.*" + "(?:\\?|/)" + "(" + possibleBase64PrefixesString + "[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/]+" + ")");
// the first alternative in the group is for the case that there are several ?
// in the url and thus encoding is incomplete - it just picks everything from
// there to the end or the next ?
const queryRegexpPlainProtocol  = new RegExp("https?://.*" +         "=" + "(" + possiblePlainPrefixesString  + "(?:[^?&;#]*[?][^?]*|[^?&;#]*)" +                                       ")");
const queryRegexpBase64Protocol = new RegExp("https?://.*" +         "=" + "(" + possibleBase64PrefixesString + "[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/]+" + ")");

// %
const percentRegExp = new RegExp("%25");
// #$&+,/:;=?@
const symbolRegExp = new RegExp("(%23|%24|%26|%2B|%2C|%2F|%3A|%3B|%3D|%3F|%40)");

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
    let preferences = simplePreferences.prefs;
    let exceptions = preferences.exceptions;
    if (exceptions.length !== 0) {
        exceptions = "|" + exceptions;
    }
    return exceptions;
}

function getPlainMatches(url) {
    let matches =
        url.match(pathRegexpPlainProtocol, "i") ||
        url.match(queryRegexpPlainProtocol, "i") ||
        undefined;
    if (matches) {
        return matches[1];
    }
}

function getBase64Matches(url) {
    let matches =
        url.match(pathRegexpBase64Protocol, "i") ||
        url.match(queryRegexpBase64Protocol, "i") ||
        undefined;
    if (matches) {
        let decodedMatch = base64.decode(matches[1]);
        if (base64CheckRegexp.test(decodedMatch, "i")) {
            return decodedMatch;
        }
    }
}

function getRedirectTarget(url) {
    if (new RegExp("(" + GLOBAL_EXCEPTIONS + getCustomExceptions() + ")").test(url)) {
        return url;
    }

    let extractedUrl = getPlainMatches(url) || getBase64Matches(url);
    if (extractedUrl) {
        return getRedirectTarget(maybeDecode(extractedUrl));
    }
    return url;
}

exports.getRedirectTarget = getRedirectTarget;
