const test = require("tape-benchmark")(require("tape"));

const psl = require("./psl");
const pslrules = require("./pslrules");

test("benchmark", function(test) {
    test.benchmark("Search through rules", function() {
        for (let entry of pslrules.NORMAL_ENTRIES) {
            "foobar.foo.bar.ck".endsWith(entry);
        }
    });
    test.benchmark("Set implementation", function() {
        psl.getDomain("foobar.foo.bar.ck");
    });
    test.end();
});
