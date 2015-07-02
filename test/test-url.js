var url = require("./url");

var tests = [
    ["www.example.com", undefined]
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
