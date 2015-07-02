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
