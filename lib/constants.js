const self = require("sdk/self");

exports.iconOn =  self.data.url("skip-on.svg");
exports.iconOff = self.data.url("skip-off.svg");

exports.labelOn = "Skip Redirect is enabled, click to disable";
exports.labelOff = "Skip Redirect is disabled, click to enable";

exports.buttonBadge = "skip";
exports.buttonRedirect = "\nLast redirect:\n";
