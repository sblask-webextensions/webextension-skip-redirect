var url = require("./url");

var sourceHTTP = "http://www.some.website.com/";
var sourceHTTPS = "https://www.some.website.com/";

var queryAndFragment = "?some=parameter&some-other=parameter;a=parameter-with-?-in-it#some-fragment";

var httpTargetDomain = "http://redirection.target.com/";
var httpTargetUrl = httpTargetDomain + queryAndFragment;
var httpTargetUrlEncoded = encodeURIComponent(httpTargetUrl);
var httpTargetUrlDoubleEncoded = encodeURIComponent(httpTargetUrlEncoded);

var wwwTargetDomain = "www.redirection.target.com/";
var wwwTargetUrl = wwwTargetDomain + queryAndFragment;
var wwwTargetUrlEncoded = encodeURIComponent(wwwTargetUrl);
var wwwTargetUrlDoubleEncoded = encodeURIComponent(wwwTargetUrlEncoded);

var noRedirectUrls = [
    httpTargetUrl,
    sourceHTTP + wwwTargetUrl.replace("www.", "www"),
    sourceHTTP + "/login?continue=" + httpTargetUrl + "#some-fragment",
    sourceHTTP + "/login?continue=" + httpTargetUrlEncoded + "#some-fragment",
    sourceHTTP + "/login?continue=" + httpTargetUrlDoubleEncoded + "#some-fragment]",
];
var noRedirectTests = [for (url of noRedirectUrls) ["no", url, url]];

function pathTest(id, source, target, expected) {
    return [
        ["pas" + id, source + target, expected],
        ["paq" + id, source + "/?" + target, expected],
    ];
}

function queryTest(id, source, target, expected) {
    return [
        ["qu01" + id, source + "/?target=" + target, expected],
        ["qu02" + id, source + "/?target=" + target + "&some=parameter", expected],
        ["qu03" + id, source + "/?target=" + target + ";some=parameter", expected],
        ["qu04" + id, source + "/?target=" + target + "#some-fragment", expected],
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
            .concat(pathTest("http",   sourceHTTP,  httpTargetUrl,              httpTargetUrl))
            .concat(pathTest("http",   sourceHTTP,  httpTargetUrlEncoded,       httpTargetUrl))
            .concat(pathTest("http",   sourceHTTP,  httpTargetUrlDoubleEncoded, httpTargetUrl))
            .concat(pathTest("https",  sourceHTTPS, httpTargetUrl,              httpTargetUrl))
            .concat(pathTest("https",  sourceHTTPS, httpTargetUrlEncoded,       httpTargetUrl))
            .concat(pathTest("https",  sourceHTTPS, httpTargetUrlDoubleEncoded, httpTargetUrl))
            .concat(pathTest("www",    sourceHTTP,  wwwTargetUrl,               "http://" + wwwTargetUrl))
            .concat(pathTest("www",    sourceHTTP,  wwwTargetUrlEncoded,        "http://" + wwwTargetUrl))
            .concat(pathTest("www",    sourceHTTP,  wwwTargetUrlDoubleEncoded,  "http://" + wwwTargetUrl))
            .concat(pathTest("wwws",   sourceHTTPS, wwwTargetUrl,               "http://" + wwwTargetUrl))
            .concat(pathTest("wwws",   sourceHTTPS, wwwTargetUrlEncoded,        "http://" + wwwTargetUrl))
            .concat(pathTest("wwws",   sourceHTTPS, wwwTargetUrlDoubleEncoded,  "http://" + wwwTargetUrl))
            .concat(queryTest("http",  sourceHTTP,  httpTargetUrl,              httpTargetDomain))
            .concat(queryTest("http",  sourceHTTP,  httpTargetUrlDoubleEncoded, httpTargetUrl))
            .concat(queryTest("http",  sourceHTTP,  httpTargetUrlEncoded,       httpTargetUrl))
            .concat(queryTest("https", sourceHTTPS, httpTargetUrl,              httpTargetDomain))
            .concat(queryTest("https", sourceHTTPS, httpTargetUrlDoubleEncoded, httpTargetUrl))
            .concat(queryTest("https", sourceHTTPS, httpTargetUrlEncoded,       httpTargetUrl))
            .concat(queryTest("www",   sourceHTTP,  wwwTargetUrl,               "http://" + wwwTargetDomain))
            .concat(queryTest("www",   sourceHTTP,  wwwTargetUrlDoubleEncoded,  "http://" + wwwTargetUrl))
            .concat(queryTest("www",   sourceHTTP,  wwwTargetUrlEncoded,        "http://" + wwwTargetUrl))
            .concat(queryTest("wwws",  sourceHTTPS, wwwTargetUrl,               "http://" + wwwTargetDomain))
            .concat(queryTest("wwws",  sourceHTTPS, wwwTargetUrlDoubleEncoded,  "http://" + wwwTargetUrl))
            .concat(queryTest("wwws",  sourceHTTPS, wwwTargetUrlEncoded,        "http://" + wwwTargetUrl))
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
