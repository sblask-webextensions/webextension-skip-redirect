const test = require("tape");

const psl = require("./psl");

test("Malformed hostname", function(assert) {
    assert.equal(psl.getDomain("....."), undefined);
    assert.equal(psl.getDomain("127.0.0.1"), undefined);
    assert.equal(psl.getDomain("foo"), undefined);
    assert.end();
});

test("Normal rules", function(assert) {
    assert.equal(psl.getDomain("com"), undefined);
    assert.equal(psl.getDomain("foo.com"), "foo.com");
    assert.equal(psl.getDomain("foo.bar.com"), "bar.com");
    assert.end();
});

test("Exception rules", function(assert) {
    assert.equal(psl.getDomain("foo.ck"), undefined);
    assert.equal(psl.getDomain("www.ck"), "www.ck");
    assert.equal(psl.getDomain("foo.www.ck"), "www.ck");
    assert.end();
});

test("Wildcard rules", function(assert) {
    assert.equal(psl.getDomain("foobar.foo.bar.ck"), "foo.bar.ck");
    assert.equal(psl.getDomain("foo.bar.ck"), "foo.bar.ck");
    assert.end();
});
