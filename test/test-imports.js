exports["test install"] = function(assert) {
    const index = require("../index");
    assert.equal(index.main({loadReason: "install"}), undefined);
    assert.equal(index.onUnload("uninstall"), undefined);
};

require("sdk/test").run(exports);
