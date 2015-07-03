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
        ["cqu01" + id, source + "/?target=" + target.clean, expected],
        ["cqu02" + id, source + "/?target=" + target.clean + "&some=parameter", expected],
        ["cqu03" + id, source + "/?target=" + target.clean + ";some=parameter", expected],
        ["cqu04" + id, source + "/?target=" + target.clean + "#some-fragment", expected],
    ];
}

function queryTest(id, source, target, expected) {
    return [
        ["qu01" + id, source + "/?target=" + target.encoded, expected],
        ["qu02" + id, source + "/?target=" + target.encoded + "&some=parameter", expected],
        ["qu03" + id, source + "/?target=" + target.encoded + ";some=parameter", expected],
        ["qu04" + id, source + "/?target=" + target.encoded + "#some-fragment", expected],

        ["qu05" + id, source + "/?target=" + target.doubleEncoded, expected],
        ["qu06" + id, source + "/?target=" + target.doubleEncoded + "&some=parameter", expected],
        ["qu07" + id, source + "/?target=" + target.doubleEncoded + ";some=parameter", expected],
        ["qu08" + id, source + "/?target=" + target.doubleEncoded + "#some-fragment", expected],
    ];
}

var otherTests = [
];

exports["test redirects"] = function(assert) {
    var tests =
        noRedirectTests
            .concat(pathTest("http",        sourceHTTP,  httpTarget, httpTargetClean))
            .concat(pathTest("www",         sourceHTTP,  wwwTarget,  "http://" + wwwTargetClean))
            .concat(pathTest("https",       sourceHTTPS, httpTarget, httpTargetClean))
            .concat(pathTest("wwws",        sourceHTTPS, wwwTarget,  "http://" + wwwTargetClean))
            .concat(queryTest("http",       sourceHTTP,  httpTarget, httpTargetClean))
            .concat(queryTest("www",        sourceHTTP,  wwwTarget,  "http://" + wwwTargetClean))
            .concat(queryTest("https",      sourceHTTPS, httpTarget, httpTargetClean))
            .concat(queryTest("wwws",       sourceHTTPS, wwwTarget,  "http://" + wwwTargetClean))
            .concat(cleanQueryTest("http",  sourceHTTP,  httpTarget, httpTargetUrl))
            .concat(cleanQueryTest("www",   sourceHTTP,  wwwTarget,  "http://" + wwwTargetUrl))
            .concat(cleanQueryTest("https", sourceHTTPS, httpTarget, httpTargetUrl))
            .concat(cleanQueryTest("wwws",  sourceHTTPS, wwwTarget,  "http://" + wwwTargetUrl))
            .concat(otherTests);
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
