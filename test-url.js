const test = require("tape");

const base64 = require("./base64");
const url = require("./url");

const queryAndFragment = "?some=parameter&some-other=parameter;another=parameter#some-fragment";

const wwwTargetUrl = "www.redirection.target.com/" + queryAndFragment;
const wwwTargetUrlEncoded = encodeURIComponent(wwwTargetUrl);
const wwwTargetUrlDoubleEncoded = encodeURIComponent(wwwTargetUrlEncoded);

const someTargetUrl = "some.www.redirection.target.com/" + queryAndFragment;
const someTargetUrlEncoded = encodeURIComponent(someTargetUrl);
const someTargetUrlDoubleEncoded = encodeURIComponent(someTargetUrlEncoded);

test("URL in query path - http URLs url-encoded and not", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http://" +             someTargetUrl, urlExceptions, parameterExceptions),                             "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http%3A%2F%2F" +       someTargetUrlEncoded, urlExceptions, parameterExceptions),                      "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http%3A%2F%2F" +       someTargetUrlEncoded + "&unwanted", urlExceptions, parameterExceptions),        "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http%253A%252F%252F" + someTargetUrlDoubleEncoded, urlExceptions, parameterExceptions),                "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http%253A%252F%252F" + someTargetUrlDoubleEncoded + "&unwanted", urlExceptions, parameterExceptions),  "http://"  + someTargetUrl);
    assert.end();
});

test("URL in query path - http URLs url-encoded and not - lowercase encoding (e.g. %2f instead of %2F)", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/"  + "http://" +             someTargetUrl).toLowerCase(), urlExceptions, parameterExceptions),              "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/"  + "http%3A%2F%2F" +       someTargetUrlEncoded).toLowerCase(), urlExceptions, parameterExceptions),       "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/"  + "http%253A%252F%252F" + someTargetUrlDoubleEncoded).toLowerCase(), urlExceptions, parameterExceptions), "http://"  + someTargetUrl);
    assert.end();
});

test("URL in query path - works with initial /? and ? instead of slash", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/?" + "http://" +  someTargetUrl, urlExceptions, parameterExceptions),                                        "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "?"  + "http://" +  someTargetUrl, urlExceptions, parameterExceptions),                                        "http://"  + someTargetUrl);
    assert.end();
});

test("URL in query path - correct http handling", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("https://" + "www.some.website.com" + "/"  + "http://" +  someTargetUrl, urlExceptions, parameterExceptions),                                        "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "https://" + someTargetUrl, urlExceptions, parameterExceptions),                                        "https://" + someTargetUrl);
    assert.end();
});

test("URL in query path - http URLs with some parts being url-encoded and others not", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http://" +  someTargetUrlEncoded, urlExceptions, parameterExceptions),                                 "http://"  + someTargetUrl);
    assert.end();
});

test("URL in query path - www URLs work without http", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  +               wwwTargetUrl, urlExceptions, parameterExceptions),                                        "http://"  + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  +               wwwTargetUrlDoubleEncoded, urlExceptions, parameterExceptions),                           "http://"  + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  +               wwwTargetUrlEncoded, urlExceptions, parameterExceptions),                                 "http://"  + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "https://" +  wwwTargetUrl, urlExceptions, parameterExceptions),                                        "https://" + wwwTargetUrl);
    assert.end();
});

test("URL in query parameter - http URLs url-encoded and not", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrl, urlExceptions, parameterExceptions),                                                  "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrl +        "?yet-another=parameter", urlExceptions, parameterExceptions),                "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + "&yet-another=parameter", urlExceptions, parameterExceptions),                "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + ";yet-another=parameter", urlExceptions, parameterExceptions),                "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + "#yet-another-fragment", urlExceptions, parameterExceptions),                 "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http%253A%252F%252F" + someTargetUrlDoubleEncoded, urlExceptions, parameterExceptions),                                     "http://" + someTargetUrl);
    assert.end();
});

test("URL in query parameter - http URLs url-encoded and not - lowercase encoding (e.g. %2f instead of %2F)", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrl).toLowerCase(), urlExceptions, parameterExceptions),                                   "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrl +        "?yet-another=parameter").toLowerCase(), urlExceptions, parameterExceptions), "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + "&yet-another=parameter").toLowerCase(), urlExceptions, parameterExceptions), "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + ";yet-another=parameter").toLowerCase(), urlExceptions, parameterExceptions), "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + "#yet-another-fragment").toLowerCase(), urlExceptions, parameterExceptions),  "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http%253A%252F%252F" + someTargetUrlDoubleEncoded).toLowerCase(), urlExceptions, parameterExceptions),                      "http://" + someTargetUrl);
    assert.end();
});

test("URL in query parameter - http URLs with some parts being url-encoded and others not", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrlEncoded, urlExceptions, parameterExceptions),                                           "http://" + someTargetUrl);
    assert.end();
});

test("URL in query parameter - www URLs work without http", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrl, urlExceptions, parameterExceptions),                                                   "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrl +        "?yet-another=parameter", urlExceptions, parameterExceptions),                 "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrlEncoded + "&yet-another=parameter", urlExceptions, parameterExceptions),                 "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrlEncoded + ";yet-another=parameter", urlExceptions, parameterExceptions),                 "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrlEncoded + "#yet-another-fragment", urlExceptions, parameterExceptions),                  "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrlDoubleEncoded, urlExceptions, parameterExceptions),                                      "http://" + wwwTargetUrl);
    assert.end();
});

test("recursion", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    const wwwTargetUrlOne = wwwTargetUrl + "-ONE";
    const wwwTargetUrlTwo = wwwTargetUrl + "-TWO";

    assert.equal(url.getRedirectTarget("http://www.some.website.com/" +                                             wwwTargetUrlOne + "/" +                                       wwwTargetUrlTwo, urlExceptions, parameterExceptions),   "http://" + wwwTargetUrlTwo);
    assert.equal(url.getRedirectTarget("http://www.some.website.com/" +                                 "http://" + wwwTargetUrlOne + "/" +                           "http://" + wwwTargetUrlTwo, urlExceptions, parameterExceptions),   "http://" + wwwTargetUrlTwo);

    assert.equal(url.getRedirectTarget("http://www.some.website.com/" + "?target=" +                                wwwTargetUrlOne + "&target=" +                                wwwTargetUrlTwo, urlExceptions, parameterExceptions),   "http://" + wwwTargetUrlTwo);
    assert.equal(url.getRedirectTarget("http://www.some.website.com/" + "?target=" +                    "http://" + wwwTargetUrlOne + "&target=" +                    "http://" + wwwTargetUrlTwo, urlExceptions, parameterExceptions),   "http://" + wwwTargetUrlTwo);
    assert.equal(url.getRedirectTarget("http://www.some.website.com/" + "?target=" + encodeURIComponent("http://" + wwwTargetUrlOne + "&target=" + encodeURIComponent("http://" + wwwTargetUrlTwo)), urlExceptions, parameterExceptions), "http://" + wwwTargetUrlTwo);

    assert.end();
});

test("URL in query parameter - multiple parameters", function(assert) {
    const urlExceptions = [];
    const someTargetUrlOne = "http://" + someTargetUrl + "-ONE";
    const someTargetUrlTwo = "http://" + someTargetUrl + "-TWO";
    const someTargetUrlOneEncoded = encodeURIComponent(someTargetUrlOne);
    const someTargetUrlTwoEncoded = encodeURIComponent(someTargetUrlTwo);

    assert.equal(url.getRedirectTarget(("http://www.some.website.com/" + "?first=" + someTargetUrlOneEncoded + "&second=" + someTargetUrlTwoEncoded), urlExceptions, ["first"]), someTargetUrlTwo);
    assert.equal(url.getRedirectTarget(("http://www.some.website.com/" + "?first=" + someTargetUrlOneEncoded + "&second=" + someTargetUrlTwoEncoded), urlExceptions, ["First"]), someTargetUrlTwo);
    assert.equal(url.getRedirectTarget(("http://www.some.website.com/" + "?first=" + someTargetUrlOneEncoded + "&second=" + someTargetUrlTwoEncoded), urlExceptions, ["second"]), someTargetUrlOne);
    assert.equal(url.getRedirectTarget(("http://www.some.website.com/" + "?first=" + someTargetUrlOneEncoded + "&second=" + someTargetUrlTwoEncoded), urlExceptions, ["Second"]), someTargetUrlOne);

    const original = "http://www.some.website.com/" + "?first=" + someTargetUrlOneEncoded + "&second=" + someTargetUrlTwoEncoded;
    assert.equal(url.getRedirectTarget(original, urlExceptions, ["first", "second"]), original);

    assert.end();
});

test("no skipping if URL matches one of given exceptions", function(assert) {
    const urlExceptions = ["/login"];
    const parameterExceptions = [];

    const noRedirectUrls = [
        wwwTargetUrl,
        "http://www.some.website.com/" + wwwTargetUrl.replace("www.", "www"),
        "http://www.some.website.com/" + "login?continue=" + wwwTargetUrl + "#some-fragment",
        "http://www.some.website.com/" + "login?continue=" + wwwTargetUrlEncoded + "#some-fragment",
        "http://www.some.website.com/" + "login?continue=" + wwwTargetUrlDoubleEncoded + "#some-fragment]",
        "http://www.some.website.com/" + "Login?continue=" + wwwTargetUrlDoubleEncoded + "#some-fragment]",
    ];

    for (const urlString of noRedirectUrls) {
        assert.equal(url.getRedirectTarget(urlString, urlExceptions, parameterExceptions), urlString);
    }

    assert.end();
});

test("base64 encoded URLs - no valid URL", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    const noUrlBase64Url = "http://" + "www.some.website.com" + "/" + base64.encode("wwwwwwww");
    assert.equal(url.getRedirectTarget(noUrlBase64Url, urlExceptions, parameterExceptions), noUrlBase64Url);
    assert.end();
});

test("base64 encoded URLs - in path", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" +                   base64.encode(wwwTargetUrl), urlExceptions, parameterExceptions),                                     "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" +                   base64.encode(wwwTargetUrl + "\n" + someTargetUrl), urlExceptions, parameterExceptions),              "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" +                   base64.encode("http://" + someTargetUrl), urlExceptions, parameterExceptions),                        "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" +                   base64.encode("http://" + someTargetUrl) + "#some-fragment", urlExceptions, parameterExceptions),     "http://" + someTargetUrl);
    assert.end();
});

test("base64 encoded URLs - in anchor", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/#" +                  base64.encode(wwwTargetUrl), urlExceptions, parameterExceptions),                                     "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/#" +                  base64.encode(wwwTargetUrl + "\n" + someTargetUrl), urlExceptions, parameterExceptions),              "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/#" +                  base64.encode("http://" + someTargetUrl), urlExceptions, parameterExceptions),                        "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/#" +                  base64.encode("http://" + someTargetUrl) + "#some-fragment", urlExceptions, parameterExceptions),     "http://" + someTargetUrl);
    assert.end();
});

test("base64 encoded URLs - in path with junk in front of it", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = [];
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "973abcCDE." +    base64.encode(wwwTargetUrl), urlExceptions, parameterExceptions),                                     "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "973abcCDE." +    base64.encode(wwwTargetUrl + "\n" + someTargetUrl), urlExceptions, parameterExceptions),              "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "973abcCDE." +    base64.encode("http://" + someTargetUrl), urlExceptions, parameterExceptions),                        "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "973abcCDE." +    base64.encode("http://" + someTargetUrl) + "#some-fragment", urlExceptions, parameterExceptions),     "http://" + someTargetUrl);
    assert.end();
});

test("base64 encoded URLs - in query string value", function(assert) {
    const urlExceptions = [];
    const parameterExceptions = []    ;
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "?target=" +      base64.encode(wwwTargetUrl), urlExceptions, parameterExceptions),                                     "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "?target=" +      base64.encode(wwwTargetUrl + "\n" + someTargetUrl), urlExceptions, parameterExceptions),              "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "?target=" +      base64.encode("http://" + someTargetUrl), urlExceptions, parameterExceptions),                        "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "?target=" +      base64.encode("http://" + someTargetUrl, urlExceptions, parameterExceptions) + "#some-fragment", urlExceptions, parameterExceptions), "http://" + someTargetUrl);
    assert.end();
});
