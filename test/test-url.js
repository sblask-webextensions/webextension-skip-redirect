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

function queryTest(id, source, target, expected) {
    return [
        ["qu07" + id, source + "/?target=" + target.encoded, expected],
        ["qu08" + id, source + "/?target=" + target.encoded + "&some=parameter", expected],
        ["qu09" + id, source + "/?target=" + target.encoded + ";some=parameter", expected],
        ["qu10" + id, source + "/?target=" + target.encoded + "#some-fragment", expected],

        ["qu11" + id, source + "/?target=" + target.doubleEncoded, expected],
        ["qu12" + id, source + "/?target=" + target.doubleEncoded + "&some=parameter", expected],
        ["qu13" + id, source + "/?target=" + target.doubleEncoded + ";some=parameter", expected],
        ["qu14" + id, source + "/?target=" + target.doubleEncoded + "#some-fragment", expected],
    ];
}

var otherTests = [
];

exports["test no redirect"] = function(assert) {
    var tests =
        noRedirectTests
            .concat(pathTest("http", sourceHTTP, httpTarget, httpTargetClean))
            .concat(pathTest("www", sourceHTTP, wwwTarget, "http://" + wwwTargetClean))
            .concat(pathTest("https", sourceHTTPS, httpTarget, httpTargetClean))
            .concat(pathTest("wwws", sourceHTTPS, wwwTarget, "http://" + wwwTargetClean))
            .concat(queryTest("http", sourceHTTP, httpTarget, httpTargetClean))
            .concat(queryTest("www", sourceHTTP, wwwTarget, "http://" + wwwTargetClean))
            .concat(queryTest("https", sourceHTTPS, httpTarget, httpTargetClean))
            .concat(queryTest("wwws", sourceHTTPS, wwwTarget, "http://" + wwwTargetClean))
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
