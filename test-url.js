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
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http://" +             someTargetUrl, urlExceptions),                             "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http%3A%2F%2F" +       someTargetUrlEncoded, urlExceptions),                      "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http%3A%2F%2F" +       someTargetUrlEncoded + "&unwanted", urlExceptions),        "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http%253A%252F%252F" + someTargetUrlDoubleEncoded, urlExceptions),                "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http%253A%252F%252F" + someTargetUrlDoubleEncoded + "&unwanted", urlExceptions),  "http://"  + someTargetUrl);
    assert.end();
});

test("URL in query path - http URLs url-encoded and not - lowercase", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/"  + "http://" +             someTargetUrl).toLowerCase(), urlExceptions),              "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/"  + "http%3A%2F%2F" +       someTargetUrlEncoded).toLowerCase(), urlExceptions),       "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/"  + "http%253A%252F%252F" + someTargetUrlDoubleEncoded).toLowerCase(), urlExceptions), "http://"  + someTargetUrl);
    assert.end();
});

test("URL in query path - works with initial /? and ? instead of slash", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/?" + "http://" +  someTargetUrl, urlExceptions),                                        "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "?"  + "http://" +  someTargetUrl, urlExceptions),                                        "http://"  + someTargetUrl);
    assert.end();
});

test("URL in query path - correct http handling", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("https://" + "www.some.website.com" + "/"  + "http://" +  someTargetUrl, urlExceptions),                                        "http://"  + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "https://" + someTargetUrl, urlExceptions),                                        "https://" + someTargetUrl);
    assert.end();
});

test("URL in query path - http URLs with some parts being url-encoded and others not", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "http://" +  someTargetUrlEncoded, urlExceptions),                                 "http://"  + someTargetUrl);
    assert.end();
});

test("URL in query path - www URLs work without http", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  +               wwwTargetUrl, urlExceptions),                                        "http://"  + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  +               wwwTargetUrlDoubleEncoded, urlExceptions),                           "http://"  + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  +               wwwTargetUrlEncoded, urlExceptions),                                 "http://"  + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/"  + "https://" +  wwwTargetUrl, urlExceptions),                                        "https://" + wwwTargetUrl);
    assert.end();
});

test("URL in query parameter - http URLs url-encoded and not", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrl, urlExceptions),                                                  "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrl +        "?yet-another=parameter", urlExceptions),                "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + "&yet-another=parameter", urlExceptions),                "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + ";yet-another=parameter", urlExceptions),                "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + "#yet-another-fragment", urlExceptions),                 "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http%253A%252F%252F" + someTargetUrlDoubleEncoded, urlExceptions),                                     "http://" + someTargetUrl);
    assert.end();
});

test("URL in query parameter - http URLs url-encoded and not - lowercase", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrl).toLowerCase(), urlExceptions),                                   "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrl +        "?yet-another=parameter").toLowerCase(), urlExceptions), "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + "&yet-another=parameter").toLowerCase(), urlExceptions), "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + ";yet-another=parameter").toLowerCase(), urlExceptions), "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http%3A%2F%2F" +       someTargetUrlEncoded + "#yet-another-fragment").toLowerCase(), urlExceptions),  "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget(("http://" + "www.some.website.com" + "/" + "?target=" + "http%253A%252F%252F" + someTargetUrlDoubleEncoded).toLowerCase(), urlExceptions),                      "http://" + someTargetUrl);
    assert.end();
});

test("URL in query parameter - http URLs with some parts being url-encoded and others not", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" + "http://" +             someTargetUrlEncoded, urlExceptions),                                           "http://" + someTargetUrl);
    assert.end();
});

test("URL in query parameter - www URLs work without http", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrl, urlExceptions),                                                   "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrl +        "?yet-another=parameter", urlExceptions),                 "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrlEncoded + "&yet-another=parameter", urlExceptions),                 "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrlEncoded + ";yet-another=parameter", urlExceptions),                 "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrlEncoded + "#yet-another-fragment", urlExceptions),                  "http://" + wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://"  + "www.some.website.com" + "/" + "?target=" +                         wwwTargetUrlDoubleEncoded, urlExceptions),                                      "http://" + wwwTargetUrl);
    assert.end();
});

test("recursion", function(assert) {
    const urlExceptions = [];
    const wwwTargetUrlOne =  wwwTargetUrl + "-ONE";
    const wwwTargetUrlTwo =  wwwTargetUrl + "-TWO";

    assert.equal(url.getRedirectTarget("http://www.some.website.com/" +                                             wwwTargetUrlOne + "/" +                                       wwwTargetUrlTwo, urlExceptions),   "http://" + wwwTargetUrlTwo);
    assert.equal(url.getRedirectTarget("http://www.some.website.com/" +                                 "http://" + wwwTargetUrlOne + "/" +                           "http://" + wwwTargetUrlTwo, urlExceptions),   "http://" + wwwTargetUrlTwo);

    assert.equal(url.getRedirectTarget("http://www.some.website.com/" + "?target=" +                                wwwTargetUrlOne + "&target=" +                                wwwTargetUrlTwo, urlExceptions),   "http://" + wwwTargetUrlTwo);
    assert.equal(url.getRedirectTarget("http://www.some.website.com/" + "?target=" +                    "http://" + wwwTargetUrlOne + "&target=" +                    "http://" + wwwTargetUrlTwo, urlExceptions),   "http://" + wwwTargetUrlTwo);
    assert.equal(url.getRedirectTarget("http://www.some.website.com/" + "?target=" + encodeURIComponent("http://" + wwwTargetUrlOne + "&target=" + encodeURIComponent("http://" + wwwTargetUrlTwo)), urlExceptions), "http://" + wwwTargetUrlTwo);

    assert.end();
});

test("no skipping if URL matches one of given exceptions", function(assert) {
    const urlExceptions = ["/login"];
    const noRedirectUrls = [
        wwwTargetUrl,
        "http://www.some.website.com/" + wwwTargetUrl.replace("www.", "www"),
        "http://www.some.website.com/" + "login?continue=" + wwwTargetUrl + "#some-fragment",
        "http://www.some.website.com/" + "login?continue=" + wwwTargetUrlEncoded + "#some-fragment",
        "http://www.some.website.com/" + "login?continue=" + wwwTargetUrlDoubleEncoded + "#some-fragment]",
        "http://www.some.website.com/" + "Login?continue=" + wwwTargetUrlDoubleEncoded + "#some-fragment]",
    ];

    for (const urlString of noRedirectUrls) {
        assert.equal(url.getRedirectTarget(urlString, urlExceptions), urlString);
    }

    assert.end();
});

test("base64 encoded URLs - no valid URL", function(assert) {
    const urlExceptions = [];
    const noUrlBase64Url = "http://" + "www.some.website.com" + "/" + base64.encode("wwwwwwww");
    assert.equal(url.getRedirectTarget(noUrlBase64Url, urlExceptions), noUrlBase64Url);
    assert.end();
});

test("base64 encoded URLs - in path", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" +                   base64.encode(wwwTargetUrl), urlExceptions),                                     "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" +                   base64.encode(wwwTargetUrl + "\n" + someTargetUrl), urlExceptions),              "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" +                   base64.encode("http://" + someTargetUrl), urlExceptions),                        "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" +                   base64.encode("http://" + someTargetUrl) + "#some-fragment", urlExceptions),     "http://" + someTargetUrl);
    assert.end();
});

test("base64 encoded URLs - in path with junk in front of it", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "973abcCDE." +    base64.encode(wwwTargetUrl), urlExceptions),                                     "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "973abcCDE." +    base64.encode(wwwTargetUrl + "\n" + someTargetUrl), urlExceptions),              "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "973abcCDE." +    base64.encode("http://" + someTargetUrl), urlExceptions),                        "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "973abcCDE." +    base64.encode("http://" + someTargetUrl) + "#some-fragment", urlExceptions),     "http://" + someTargetUrl);
    assert.end();
});

test("base64 encoded URLs - in query string value", function(assert) {
    const urlExceptions = [];
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "?target=" +      base64.encode(wwwTargetUrl), urlExceptions),                                     "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "?target=" +      base64.encode(wwwTargetUrl + "\n" + someTargetUrl), urlExceptions),              "http://" +  wwwTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "?target=" +      base64.encode("http://" + someTargetUrl), urlExceptions),                        "http://" + someTargetUrl);
    assert.equal(url.getRedirectTarget("http://" + "www.some.website.com" + "/" + "?target=" +      base64.encode("http://" + someTargetUrl, urlExceptions) + "#some-fragment", urlExceptions), "http://" + someTargetUrl);
    assert.end();
});
