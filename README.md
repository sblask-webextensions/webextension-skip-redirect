[![Build Status](https://travis-ci.org/sblask/webextension-skip-redirect.svg?branch=master)](https://travis-ci.org/sblask/webextension-skip-redirect)

Skip Redirect
=====================
Some web pages use intermediary pages before redirecting to a final page. This
webextension tries to extract the final url from the intermediary url and goes
there straight away if successful. As an example, try this url:

 - www.google.com/chrome/?or-maybe-rather-firefox=http%3A%2F%2Fwww.mozilla.org/

Please give feedback(see below) if you find websites where this fails or where
you get redirected in a weird way when this add-on is enabled but not when it's
disabled.

See the add-on's preferences (also available by clicking the toolbar icon) for
options. By default all URLs but the ones matching a blacklist are checked for
embedded URLs and redirects are skipped. Depending on the pages visited, this
can cause problems. For example a dysfunctional login. The blacklist can be
edited to avoid these problems. There is also a whitelist mode to avoid this
kind of problem altogether. In whitelist mode, all URLs for which redirects
should be skipped need to be configured by hand.

Feedback
--------

You can report bugs or make feature requests on
[Github](https://github.com/sblask/webextension-skip-redirect).

Patches are welcome.
