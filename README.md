[![Build Status](https://travis-ci.org/sblask/firefox-skip-redirect.svg?branch=master)](https://travis-ci.org/sblask/firefox-skip-redirect)

firefox-skip-redirect
=====================
Some web pages use intermediary pages before redirecting to a final page. This
add-on tries to extract the final url from the intermediary url and goes there
straight away if successful. As an example, try this url:

 - www.google.com/chrome/?i-would-rather-use-firefox=http%3A%2F%2Fwww.mozilla.org/

Please give feedback(see below) if you find websites where this fails or where
you get redirected in a weird way when this add-on is enabled but not when it's
disabled.

There is a toolbar button which you can use to quickly enable/disable skipping.
The button displays an indicator for a couple of seconds(see the add-on's
preferences) when a redirect is skipped and information about original and
final link is shown in its tooltip.

This add-on aims for similar functionality as the following add-ons but in a
simpler and/or better documented way:
[Redirect Bypasser](https://addons.mozilla.org/en-US/firefox/addon/redirectbypasser/) /
[Redirect Remover](https://addons.mozilla.org/en-US/firefox/addon/redirect-remover/) /
[RedirectCleaner](https://addons.mozilla.org/en-US/firefox/addon/redirectcleaner/)

This add-on is developed using the [Mozilla Add-on
SDK](https://developer.mozilla.org/en-US/Add-ons/SDK).

Feedback
--------

You can report bugs or make feature requests on
[Github](https://github.com/sblask/firefox-skip-redirect).

Patches are welcome.
