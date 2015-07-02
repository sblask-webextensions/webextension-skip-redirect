var url = require("./url");


var targetClean = "http://redirection.target.com/?some=parameter&some-other=parameter;yet-another=parameter#some-fragment";
var targetEncoded = encodeURIComponent(targetClean);

var tests = [
    [targetClean, undefined],
    ["http://some.website.com/?target=" + targetEncoded, targetClean],
    ["http://some.website.com/?target=" + targetEncoded + "&some=parameter", targetClean],
    ["http://some.website.com/?target=" + targetEncoded + ";some=parameter", targetClean],
    ["http://some.website.com/?target=" + targetEncoded + "#some-fragment", targetClean],
    ["http://some.website.com/login?continue=" + targetEncoded + "#some-fragment", undefined],
];

exports["test no redirect"] = function(assert) {
    for (var index = 0; index < tests.length; index++) {
        var from = tests[index][0];
        var to = tests[index][1];
        assert.equal(
           url.getRedirectTarget(from),
           to,
           "Wrong redirection target for " + from
        );
    }
};

require("sdk/test").run(exports);
