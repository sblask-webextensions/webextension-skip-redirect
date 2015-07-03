var url = require("./url");

var sourceHTTP = "http://www.some.website.com/";
var sourceHTTPS = "https://www.some.website.com/";

var queryAndFragment = "?some=parameter&some-other=parameter;yet-another=parameter#some-fragment";

var httpTargetClean = "http://redirection.target.com/" + queryAndFragment;
var httpTargetEncoded = encodeURIComponent(httpTargetClean);
var httpTargetDoubleEncoded = encodeURIComponent(httpTargetEncoded);

var httpTarget = {
    clean: httpTargetClean,
    encoded: httpTargetEncoded,
    doubleEncoded: httpTargetDoubleEncoded,
};

var wwwTargetClean = "www.redirection.target.com/" + queryAndFragment;
var wwwTargetEncoded = encodeURIComponent(wwwTargetClean);
var wwwTargetDoubleEncoded = encodeURIComponent(wwwTargetEncoded);

var wwwTarget = {
    clean: wwwTargetClean,
    encoded: wwwTargetEncoded,
    doubleEncoded: wwwTargetDoubleEncoded,
};

var noRedirectTests = [
    ["no1", httpTargetClean, undefined],
    ["no2", sourceHTTP + wwwTargetClean.replace("www.", "www"), undefined],
    ["no3", sourceHTTP + "/login?continue=" + httpTargetClean + "#some-fragment", undefined],
    ["no4", sourceHTTP + "/login?continue=" + httpTargetEncoded + "#some-fragment", undefined],
    ["no5", sourceHTTP + "/login?continue=" + httpTargetDoubleEncoded + "#some-fragment", undefined],
];

function cleanTest(source, target, expected) {
    return [
        ["cl01", source + target.clean, expected],
        ["cl02", source + target.encoded, expected],
        ["cl03", source + target.doubleEncoded, expected],

        ["cl04", source + "/?" + target.clean, expected],
        ["cl05", source + "/?" + target.encoded, expected],
        ["cl06", source + "/?" + target.doubleEncoded, expected],

        ["cl07", source + "/?target=" + target.encoded, expected],
        ["cl08", source + "/?target=" + target.encoded + "&some=parameter", expected],
        ["cl09", source + "/?target=" + target.encoded + ";some=parameter", expected],
        ["cl10", source + "/?target=" + target.encoded + "#some-fragment", expected],

        ["cl11", source + "/?target=" + target.doubleEncoded, expected],
        ["cl12", source + "/?target=" + target.doubleEncoded + "&some=parameter", expected],
        ["cl13", source + "/?target=" + target.doubleEncoded + ";some=parameter", expected],
        ["cl14", source + "/?target=" + target.doubleEncoded + "#some-fragment", expected],
    ];
}

var otherTests = [
];

exports["test no redirect"] = function(assert) {
    var tests =
        noRedirectTests
            .concat(cleanTest(sourceHTTP, httpTarget, httpTargetClean))
            .concat(cleanTest(sourceHTTP, wwwTarget, "http://" + wwwTargetClean))
            .concat(cleanTest(sourceHTTPS, httpTarget, httpTargetClean))
            .concat(cleanTest(sourceHTTPS, wwwTarget, "http://" + wwwTargetClean))
            .concat(otherTests);
    for (var index = 0; index < tests.length; index++) {
        var testID = tests[index][0];
        var from = tests[index][1];
        var to = tests[index][2];
        assert.equal(
           url.getRedirectTarget(from),
           to,
           testID + ": Wrong redirection target for " + from
        );
    }
};

require("sdk/test").run(exports);
