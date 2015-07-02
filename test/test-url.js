var url = require("./url");

var sourceHTTP = "http://www.some.website.com/";
var sourceHTTPS = "https://www.some.website.com/";

var queryAndFragment = "?some=parameter&some-other=parameter;yet-another=parameter#some-fragment";

var targetClean = "http://redirection.target.com/" + queryAndFragment;
var targetEncoded = encodeURIComponent(targetClean);
var targetDoubleEncoded = encodeURIComponent(targetEncoded);

var wwwTargetClean = "www.redirection.target.com/" + queryAndFragment;
var wwwTargetEncoded = encodeURIComponent(wwwTargetClean);
var wwwTargetDoubleEncoded = encodeURIComponent(wwwTargetEncoded);

var noRedirectTests = [
    ["no1", targetClean, undefined],
    ["no2", sourceHTTP + wwwTargetClean.replace("www.", "www"), undefined],
    ["no3", sourceHTTP + "/login?continue=" + targetClean + "#some-fragment", undefined],
    ["no4", sourceHTTP + "/login?continue=" + targetEncoded + "#some-fragment", undefined],
    ["no5", sourceHTTP + "/login?continue=" + targetDoubleEncoded + "#some-fragment", undefined],
];

function cleanTest(source, clean, encoded, doubleEncoded, expected) {
    return [
        ["clean01", source + clean, expected],
        ["clean02", source + encoded, expected],
        ["clean03", source + doubleEncoded, expected],

        ["clean04", source + "/?" + clean, expected],
        ["clean05", source + "/?" + encoded, expected],
        ["clean06", source + "/?" + doubleEncoded, expected],

        ["clean07", source + "/?target=" + encoded, expected],
        ["clean08", source + "/?target=" + encoded + "&some=parameter", expected],
        ["clean09", source + "/?target=" + encoded + ";some=parameter", expected],
        ["clean10", source + "/?target=" + encoded + "#some-fragment", expected],

        ["clean11", source + "/?target=" + doubleEncoded, expected],
        ["clean12", source + "/?target=" + doubleEncoded + "&some=parameter", expected],
        ["clean13", source + "/?target=" + doubleEncoded + ";some=parameter", expected],
        ["clean14", source + "/?target=" + doubleEncoded + "#some-fragment", expected],
    ];
}

var otherTests = [
];

exports["test no redirect"] = function(assert) {
    var tests =
        noRedirectTests
            .concat(cleanTest(sourceHTTP, targetClean, targetEncoded, targetDoubleEncoded, targetClean))
            .concat(cleanTest(sourceHTTP, wwwTargetClean, wwwTargetEncoded, wwwTargetDoubleEncoded, "http://" + wwwTargetClean))
            .concat(cleanTest(sourceHTTPS, targetClean, targetEncoded, targetDoubleEncoded, targetClean))
            .concat(cleanTest(sourceHTTPS, wwwTargetClean, wwwTargetEncoded, wwwTargetDoubleEncoded, "http://" + wwwTargetClean))
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
