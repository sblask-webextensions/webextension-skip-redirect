exports["test install"] = function(assert) {
    const index = require("../index");
    assert.equal(index.main({}), undefined);
};

require("sdk/test").run(exports);
