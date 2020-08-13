const test = require("tape");

const util = require("./util");

const DEFAULT_TARGET = [
    "one",
    "two",
    "three",
];

const DEFAULT_SOURCE = [
    "four",
    "five",
    "six",
];

test("Test mergeList - null source", function(assert) {
    const source = null;
    const merged = util.mergeList(
        DEFAULT_TARGET,
        source,
    );
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(DEFAULT_TARGET),
    );
    assert.end();
});

test("Test mergeList - empty source", function(assert) {
    const merged = util.mergeList(
        DEFAULT_TARGET,
        [],
    );
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(DEFAULT_TARGET),
    );
    assert.end();
});

test("Test mergeList - null target", function(assert) {
    const merged = util.mergeList(
        null,
        DEFAULT_SOURCE,
    );
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(DEFAULT_SOURCE),
    );
    assert.end();
});

test("Test mergeList - empty target", function(assert) {
    const merged = util.mergeList(
        [],
        DEFAULT_SOURCE,
    );
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(DEFAULT_SOURCE),
    );
    assert.end();
});

test("Test mergeList - null source and target", function(assert) {
    const merged = util.mergeList(
        null,
        null,
    );
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify([]),
    );
    assert.end();
});

test("Test mergeList - empty source and target", function(assert) {
    const merged = util.mergeList(
        [],
        [],
    );
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify([]),
    );
    assert.end();
});

test("Test mergeList - nothing common", function(assert) {
    const merged = util.mergeList(
        DEFAULT_TARGET,
        DEFAULT_SOURCE,
    );
    const expected = [
        ...DEFAULT_TARGET,
        ...DEFAULT_SOURCE,
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
        ...DEFAULT_SOURCE,
    ];
    const merged = util.mergeList(
        DEFAULT_TARGET,
        source,
    );
    const expected = [
        ...DEFAULT_TARGET,
        ...DEFAULT_SOURCE,
    ];
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - common at the end", function(assert) {
    const source = [
        ...DEFAULT_SOURCE,
        "one",
    ];
    const merged = util.mergeList(
        DEFAULT_TARGET,
        source,
    );
    const expected = [
        ...DEFAULT_TARGET,
        ...DEFAULT_SOURCE,
    ];
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(expected),
    );
    assert.end();
});

test("Test mergeList - common in the middle", function(assert) {
    const source = [...DEFAULT_SOURCE];
    source.splice(2, 0, "one");
    const merged = util.mergeList(
        DEFAULT_TARGET,
        source,
    );
    const expected = [
        ...DEFAULT_TARGET,
        ...DEFAULT_SOURCE,
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
    const merged = util.mergeList(
        DEFAULT_TARGET,
        source,
    );
    assert.equal(
        JSON.stringify(merged),
        JSON.stringify(DEFAULT_TARGET),
    );
    assert.end();
});
