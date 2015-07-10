var url = require("./url");

var sourceHTTP = "http://www.some.website.com/";
var sourceHTTPS = "https://www.some.website.com/";

var queryAndFragment = "?some=parameter&some-other=parameter;a=parameter-with-?-in-it#some-fragment";

var httpTargetUrl = "http://redirection.target.com/";
var httpTargetClean = httpTargetUrl + queryAndFragment;
var httpTargetEncoded = encodeURIComponent(httpTargetClean);
var httpTargetDoubleEncoded = encodeURIComponent(httpTargetEncoded);

var httpTarget = {
    clean: httpTargetClean,
    encoded: httpTargetEncoded,
    doubleEncoded: httpTargetDoubleEncoded,
};

var wwwTargetUrl = "www.redirection.target.com/";
var wwwTargetClean = wwwTargetUrl + queryAndFragment;
var wwwTargetEncoded = encodeURIComponent(wwwTargetClean);
var wwwTargetDoubleEncoded = encodeURIComponent(wwwTargetEncoded);

var wwwTarget = {
    clean: wwwTargetClean,
    encoded: wwwTargetEncoded,
    doubleEncoded: wwwTargetDoubleEncoded,
};

var noRedirectUrls = [
    httpTargetClean,
    sourceHTTP + wwwTargetClean.replace("www.", "www"),
    sourceHTTP + "/login?continue=" + httpTargetClean + "#some-fragment",
    sourceHTTP + "/login?continue=" + httpTargetEncoded + "#some-fragment",
    sourceHTTP + "/login?continue=" + httpTargetDoubleEncoded + "#some-fragment]",
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
    ["tt1", sourceHTTP + "?url-one=" + wwwTargetUrl + "&url-two=" + someOtherTargetUrl, "http://" + someOtherTargetUrl],
    ["tt1", sourceHTTP + "?url-one=" + httpTargetUrl + "&url-two=" + "http://" + someOtherTargetUrl, "http://" + someOtherTargetUrl],
];

exports["test redirects"] = function(assert) {
    var tests =
        []
            .concat(noRedirectTests)
            .concat(pathTest("http",                sourceHTTP,  httpTarget, httpTargetClean))
            .concat(pathTest("www",                 sourceHTTP,  wwwTarget,  "http://" + wwwTargetClean))
            .concat(pathTest("https",               sourceHTTPS, httpTarget, httpTargetClean))
            .concat(pathTest("wwws",                sourceHTTPS, wwwTarget,  "http://" + wwwTargetClean))
            .concat(cleanQueryTest("http",          sourceHTTP,  httpTarget, httpTargetUrl))
            .concat(cleanQueryTest("www",           sourceHTTP,  wwwTarget,  "http://" + wwwTargetUrl))
            .concat(cleanQueryTest("https",         sourceHTTPS, httpTarget, httpTargetUrl))
            .concat(cleanQueryTest("wwws",          sourceHTTPS, wwwTarget,  "http://" + wwwTargetUrl))
            .concat(encodedQueryTest("http",        sourceHTTP,  httpTarget, httpTargetUrl))
            .concat(encodedQueryTest("www",         sourceHTTP,  wwwTarget,  "http://" + wwwTargetUrl))
            .concat(encodedQueryTest("https",       sourceHTTPS, httpTarget, httpTargetUrl))
            .concat(encodedQueryTest("wwws",        sourceHTTPS, wwwTarget,  "http://" + wwwTargetUrl))
            .concat(doubleEncodedQueryTest("http",  sourceHTTP,  httpTarget, httpTargetUrl))
            .concat(doubleEncodedQueryTest("www",   sourceHTTP,  wwwTarget,  "http://" + wwwTargetUrl))
            .concat(doubleEncodedQueryTest("https", sourceHTTPS, httpTarget, httpTargetUrl))
            .concat(doubleEncodedQueryTest("wwws",  sourceHTTPS, wwwTarget,  "http://" + wwwTargetUrl))
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
