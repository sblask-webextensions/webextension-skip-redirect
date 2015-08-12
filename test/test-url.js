var url = require("./url");

var sourceHTTP = "http://www.some.website.com/";
var sourceHTTPS = "https://www.some.website.com/";

var queryAndFragment = "?some=parameter&some-other=parameter;a=parameter-with-?-in-it#some-fragment";

var httpTargetDomain = "http://www.redirection.target.com/";
var httpTargetUrl = httpTargetDomain + queryAndFragment;
var httpTargetUrlEncoded = encodeURIComponent(httpTargetUrl);
var httpTargetUrlDoubleEncoded = encodeURIComponent(httpTargetUrlEncoded);
var httpTargetUrlIncompletelyEncoded = httpTargetDomain + encodeURIComponent(queryAndFragment);

var wwwTargetDomain = "www.redirection.target.com/";
var wwwTargetUrl = wwwTargetDomain + queryAndFragment;
var wwwTargetUrlEncoded = encodeURIComponent(wwwTargetUrl);
var wwwTargetUrlDoubleEncoded = encodeURIComponent(wwwTargetUrlEncoded);
var wwwTargetUrlIncompletelyEncoded = wwwTargetDomain + encodeURIComponent(queryAndFragment);

var noRedirectUrls = [
    httpTargetUrl,
    sourceHTTP + wwwTargetUrl.replace("www.", "www"),
    sourceHTTP + "login?continue=" + httpTargetUrl + "#some-fragment",
    sourceHTTP + "login?continue=" + httpTargetUrlEncoded + "#some-fragment",
    sourceHTTP + "login?continue=" + httpTargetUrlDoubleEncoded + "#some-fragment]",
];
var noRedirectTests = [for (url of noRedirectUrls) [url, url]];

function pathTest(source, target, expected) {
    return [
        [source + target, expected],
        [source + "?" + target, expected],
    ];
}

function queryTest(source, target, expected) {
    return [
        [source + "?target=" + target, expected],
        [source + "?target=" + target + "&some=parameter", expected],
        [source + "?target=" + target + ";some=parameter", expected],
        [source + "?target=" + target + "#some-fragment", expected],
    ];
}

var someOtherTargetUrl = "www.some.other.website.com";
var twoTargetsTests = [
    [sourceHTTP + "?url-one=" + wwwTargetDomain + "&url-two=" + someOtherTargetUrl, "http://" + someOtherTargetUrl],
    [sourceHTTP + "?url-one=" + httpTargetDomain + "&url-two=" + "http://" + someOtherTargetUrl, "http://" + someOtherTargetUrl],
];

exports["test redirects"] = function(assert) {
    var tests =
        []
            .concat(noRedirectTests)
            .concat(pathTest(sourceHTTP,   httpTargetUrl,                    httpTargetUrl))
            .concat(pathTest(sourceHTTP,   httpTargetUrlDoubleEncoded,       httpTargetUrl))
            .concat(pathTest(sourceHTTP,   httpTargetUrlEncoded,             httpTargetUrl))
            .concat(pathTest(sourceHTTP,   httpTargetUrlIncompletelyEncoded, httpTargetUrl))
            .concat(pathTest(sourceHTTPS,  httpTargetUrl,                    httpTargetUrl))
            .concat(pathTest(sourceHTTPS,  httpTargetUrlDoubleEncoded,       httpTargetUrl))
            .concat(pathTest(sourceHTTPS,  httpTargetUrlEncoded,             httpTargetUrl))
            .concat(pathTest(sourceHTTPS,  httpTargetUrlIncompletelyEncoded, httpTargetUrl))
            .concat(pathTest(sourceHTTP,   wwwTargetUrl,                     "http://" + wwwTargetUrl))
            .concat(pathTest(sourceHTTP,   wwwTargetUrlDoubleEncoded,        "http://" + wwwTargetUrl))
            .concat(pathTest(sourceHTTP,   wwwTargetUrlEncoded,              "http://" + wwwTargetUrl))
            .concat(pathTest(sourceHTTP,   wwwTargetUrlIncompletelyEncoded,  "http://" + wwwTargetUrl))
            .concat(pathTest(sourceHTTPS,  wwwTargetUrl,                     "http://" + wwwTargetUrl))
            .concat(pathTest(sourceHTTPS,  wwwTargetUrlEncoded,              "http://" + wwwTargetUrl))
            .concat(pathTest(sourceHTTPS,  wwwTargetUrlDoubleEncoded,        "http://" + wwwTargetUrl))
            .concat(pathTest(sourceHTTPS,  wwwTargetUrlIncompletelyEncoded,  "http://" + wwwTargetUrl))
            .concat(queryTest(sourceHTTP,  httpTargetUrl,                    httpTargetUrl.slice(0, httpTargetUrl.lastIndexOf("?"))))
            .concat(queryTest(sourceHTTP,  httpTargetUrlDoubleEncoded,       httpTargetUrl))
            .concat(queryTest(sourceHTTP,  httpTargetUrlEncoded,             httpTargetUrl))
            .concat(queryTest(sourceHTTP,  httpTargetUrlIncompletelyEncoded, httpTargetUrl))
            .concat(queryTest(sourceHTTPS, httpTargetUrl,                    httpTargetUrl.slice(0, httpTargetUrl.lastIndexOf("?"))))
            .concat(queryTest(sourceHTTPS, httpTargetUrlDoubleEncoded,       httpTargetUrl))
            .concat(queryTest(sourceHTTPS, httpTargetUrlEncoded,             httpTargetUrl))
            .concat(queryTest(sourceHTTPS, httpTargetUrlIncompletelyEncoded, httpTargetUrl))
            .concat(queryTest(sourceHTTP,  wwwTargetUrl,                     "http://" + wwwTargetUrl.slice(0, wwwTargetUrl.lastIndexOf("?"))))
            .concat(queryTest(sourceHTTP,  wwwTargetUrlDoubleEncoded,        "http://" + wwwTargetUrl))
            .concat(queryTest(sourceHTTP,  wwwTargetUrlEncoded,              "http://" + wwwTargetUrl))
            .concat(queryTest(sourceHTTP,  wwwTargetUrlIncompletelyEncoded,  "http://" + wwwTargetUrl))
            .concat(queryTest(sourceHTTPS, wwwTargetUrl,                     "http://" + wwwTargetUrl.slice(0, wwwTargetUrl.lastIndexOf("?"))))
            .concat(queryTest(sourceHTTPS, wwwTargetUrlDoubleEncoded,        "http://" + wwwTargetUrl))
            .concat(queryTest(sourceHTTPS, wwwTargetUrlEncoded,              "http://" + wwwTargetUrl))
            .concat(queryTest(sourceHTTPS, wwwTargetUrlIncompletelyEncoded,  "http://" + wwwTargetUrl))
            .concat(twoTargetsTests)
            .concat([]);
    for (var index = 0; index < tests.length; index++) {
        var [ from, to ] = tests[index];
        assert.equal(
           url.getRedirectTarget(from),
           to,
           "Wrong redirection target for " + from
        );
    }
};

require("sdk/test").run(exports);
