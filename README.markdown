Simple JavaScript DOM Inspector v0.1.1
====================================

Highlights hovered elements with a 2px red outline, and then logs the element's full 
CSS selector path when clicked. It could also display the selected element's XPath,
or do pretty much anything with it in the callback function.

The CSS selector path-building code tries to be as specific as possible, but can also
build a more optimised CSS selector, stopping at the first parent with a specific ID.

It also checks to see whether any part of the CSS path matches multiple elements, or if
any element has no ID or CSS class, and adds specific "nth-child" pseudo-selectors
where needed for full CSS paths.

* Example full CSS path: `html body #main #content .left-col p img:nth-child(1)`
* Example optimised CSS path: `#content .left-col p img`

Hit escape key to cancel the inspector.

NB: XPath code removed as it didn't really work very well, need to write from scratch.

Started putting in IE support, but won't work in IE just yet, check back next week
for that (so far, tested in FF4, Chrome, Safari, Opera 11.)

No warranty; probably won't break the internet. Improvements and linkbacks welcome!

Joss