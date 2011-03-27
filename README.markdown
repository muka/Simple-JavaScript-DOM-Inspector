Simple JavaScript DOM Inspector v0.1
====================================

Highlights hovered elements with a 2px red outline, and then logs the element's full 
CSS selector path when clicked. You can also display the selected element's XPath, if
that's your kinda thing, or do anything with it in the callback function.

The CSS selector path-getting code tries to be as specific as possible, but could be
cut down to make an optimised selector. It works its way up the element's parentNodes
to build a full jQuery-style selector string with each element's ID and CSS class.

It also checks to see whether any part of the CSS path matches multiple elements, or if
any element has no ID or CSS class, and adds specific "nth-child" pseudo-selectors
where needed, eg. "p:nth-of-type(3)".

Hit escape key to cancel the inspector.

NB: XPath code removed as it didn't really work very well, need to write from scratch.

Started putting in IE support, but won't work in IE just yet, check back next week
for that (so far, tested in FF4, Chrome, Safari, Opera 11.)

No warranty; probably won't break the internet. Improvements and linkbacks welcome!

 
- Joss