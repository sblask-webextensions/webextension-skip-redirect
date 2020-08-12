const test = require("tape");

const util = require("./util");

const DEFAULT_TARGET = [
    "one",
    "two",
    "three",
];

test("Test mergeList - null source", function(assert) {
    const source = null;
    const merged = util.mergeList(DEFAULT_TARGET, source);
    const expected = DEFAULT_TARGET;
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - empty source", function(assert) {
    const source = [];
    const merged = util.mergeList(DEFAULT_TARGET, source);
    const expected = DEFAULT_TARGET;
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - null target", function(assert) {
    const source = [
        "four",
        "five",
        "six",
    ];
    const merged = util.mergeList(null, source);
    const expected = source;
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - empty target", function(assert) {
    const source = [
        "four",
        "five",
        "six",
    ];
    const merged = util.mergeList([], source);
    const expected = source;
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - null source and target", function(assert) {
    const merged = util.mergeList(null, null);
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify([]),
    );
    assert.end();
});

test("Test mergeList - nothing common", function(assert) {
    const source = [
        "four",
        "five",
        "six",
    ];
    const merged = util.mergeList(DEFAULT_TARGET, source);
    const expected = [
        ...DEFAULT_TARGET,
        ...source,
    ];
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - common at beginning", function(assert) {
    const source = [
        "one",
        "four",
        "five",
        "six",
    ];
    const merged = util.mergeList(DEFAULT_TARGET, source);
    const expected = [
        ...DEFAULT_TARGET,
        "four",
        "five",
        "six",
    ];
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - common at the end", function(assert) {
    const source = [
        "four",
        "five",
        "six",
        "one",
    ];
    const merged = util.mergeList(DEFAULT_TARGET, source);
    const expected = [
        ...DEFAULT_TARGET,
        "four",
        "five",
        "six",
    ];
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - common in the middle", function(assert) {
    const source = [
        "four",
        "four",
        "five",
        "six",
    ];
    const merged = util.mergeList(DEFAULT_TARGET, source);
    const expected = [
        ...DEFAULT_TARGET,
        ...source,
    ];
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - different order", function(assert) {
    const source = [
        "three",
        "two",
        "one",
    ];
    const merged = util.mergeList(DEFAULT_TARGET, source);
    const expected = DEFAULT_TARGET;
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});
