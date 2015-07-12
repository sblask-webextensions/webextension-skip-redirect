var url = require("./url");

var sourceHTTP = "http://www.some.website.com/";
var sourceHTTPS = "https://www.some.website.com/";

var queryAndFragment = "?some=parameter&some-other=parameter;a=parameter-with-?-in-it#some-fragment";

var httpTargetDomain = "http://redirection.target.com/";
var httpTargetUrl = httpTargetDomain + queryAndFragment;
var httpTargetUrlEncoded = encodeURIComponent(httpTargetUrl);
var httTargetUrlDoubleEncoded = encodeURIComponent(httpTargetUrlEncoded);

var httpTargetMapping = {
    clean: httpTargetUrl,
    encoded: httpTargetUrlEncoded,
    doubleEncoded: httTargetUrlDoubleEncoded,
};

var wwwTargetDomain = "www.redirection.target.com/";
var wwwTargetUrl = wwwTargetDomain + queryAndFragment;
var wwwTargetUrlEncoded = encodeURIComponent(wwwTargetUrl);
var wwwTargetUrlDoubleEncoded = encodeURIComponent(wwwTargetUrlEncoded);

var wwwTargetMapping = {
    clean: wwwTargetUrl,
    encoded: wwwTargetUrlEncoded,
    doubleEncoded: wwwTargetUrlDoubleEncoded,
};

var noRedirectUrls = [
    httpTargetUrl,
    sourceHTTP + wwwTargetUrl.replace("www.", "www"),
    sourceHTTP + "/login?continue=" + httpTargetUrl + "#some-fragment",
    sourceHTTP + "/login?continue=" + httpTargetUrlEncoded + "#some-fragment",
    sourceHTTP + "/login?continue=" + httTargetUrlDoubleEncoded + "#some-fragment]",
];
var noRedirectTests = [for (url of noRedirectUrls) ["no", url, url]];

function pathTest(id, source, target, expected) {
    return [
        ["pa01" + id, source + target.clean, expected],
        ["pa02" + id, source + target.encoded, expected],
        ["pa03" + id, source + target.doubleEncoded, expected],

        ["pa04" + id, source + "/?" + target.clean, expected],
        ["pa05" + id, source + "/?" + target.encoded, expected],
        ["pa06" + id, source + "/?" + target.doubleEncoded, expected],
    ];
}

function cleanQueryTest(id, source, target, expected) {
    return [
        ["quc01" + id, source + "/?target=" + target.clean, expected],
        ["quc02" + id, source + "/?target=" + target.clean + "&some=parameter", expected],
        ["quc03" + id, source + "/?target=" + target.clean + ";some=parameter", expected],
        ["quc04" + id, source + "/?target=" + target.clean + "#some-fragment", expected],
    ];
}

function encodedQueryTest(id, source, target, expected) {
    return [
        ["que01" + id, source + "/?target=" + target.encoded, expected],
        ["que02" + id, source + "/?target=" + target.encoded + "&some=parameter", expected],
        ["que03" + id, source + "/?target=" + target.encoded + ";some=parameter", expected],
        ["que04" + id, source + "/?target=" + target.encoded + "#some-fragment", expected],
    ];
}

function doubleEncodedQueryTest(id, source, target, expected) {
    return [
        ["qud01" + id, source + "/?target=" + target.doubleEncoded, expected],
        ["qud02" + id, source + "/?target=" + target.doubleEncoded + "&some=parameter", expected],
        ["qud03" + id, source + "/?target=" + target.doubleEncoded + ";some=parameter", expected],
        ["qud04" + id, source + "/?target=" + target.doubleEncoded + "#some-fragment", expected],
    ];
}

var someOtherTargetUrl = "www.some.other.website.com";
var twoTargetsTests = [
    ["tt1", sourceHTTP + "?url-one=" + wwwTargetDomain + "&url-two=" + someOtherTargetUrl, "http://" + someOtherTargetUrl],
    ["tt1", sourceHTTP + "?url-one=" + httpTargetDomain + "&url-two=" + "http://" + someOtherTargetUrl, "http://" + someOtherTargetUrl],
];

exports["test redirects"] = function(assert) {
    var tests =
        []
            .concat(noRedirectTests)
            .concat(pathTest("http",                sourceHTTP,  httpTargetMapping, httpTargetUrl))
            .concat(pathTest("www",                 sourceHTTP,  wwwTargetMapping,  "http://" + wwwTargetUrl))
            .concat(pathTest("https",               sourceHTTPS, httpTargetMapping, httpTargetUrl))
            .concat(pathTest("wwws",                sourceHTTPS, wwwTargetMapping,  "http://" + wwwTargetUrl))
            .concat(cleanQueryTest("http",          sourceHTTP,  httpTargetMapping, httpTargetDomain))
            .concat(cleanQueryTest("www",           sourceHTTP,  wwwTargetMapping,  "http://" + wwwTargetDomain))
            .concat(cleanQueryTest("https",         sourceHTTPS, httpTargetMapping, httpTargetDomain))
            .concat(cleanQueryTest("wwws",          sourceHTTPS, wwwTargetMapping,  "http://" + wwwTargetDomain))
            .concat(encodedQueryTest("http",        sourceHTTP,  httpTargetMapping, httpTargetUrl))
            .concat(encodedQueryTest("www",         sourceHTTP,  wwwTargetMapping,  "http://" + wwwTargetUrl))
            .concat(encodedQueryTest("https",       sourceHTTPS, httpTargetMapping, httpTargetUrl))
            .concat(encodedQueryTest("wwws",        sourceHTTPS, wwwTargetMapping,  "http://" + wwwTargetUrl))
            .concat(doubleEncodedQueryTest("http",  sourceHTTP,  httpTargetMapping, httpTargetUrl))
            .concat(doubleEncodedQueryTest("www",   sourceHTTP,  wwwTargetMapping,  "http://" + wwwTargetUrl))
            .concat(doubleEncodedQueryTest("https", sourceHTTPS, httpTargetMapping, httpTargetUrl))
            .concat(doubleEncodedQueryTest("wwws",  sourceHTTPS, wwwTargetMapping,  "http://" + wwwTargetUrl))
            .concat(twoTargetsTests)
            .concat([]);
    for (var index = 0; index < tests.length; index++) {
        var [ testID, from, to ] = tests[index];
        assert.equal(
           url.getRedirectTarget(from),
           to,
           testID + ": Wrong redirection target for " + from
        );
    }
};

require("sdk/test").run(exports);
