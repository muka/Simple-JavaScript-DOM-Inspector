/**
 * Simple JavaScript DOM Inspector v0.1
 *
 * Highlights hovered elements with a 2px red outline, and then logs the element's full 
 * CSS selector path when clicked. You can also display the selected element's XPath, if
 * that's your kinda thing, or do anything with it in the callback function.
 * 
 * The CSS selector path-getting code tries to be as specific as possible, but could be
 * cut down to make an optimised selector. It works its way up the element's parentNodes
 * to build a full jQuery-style selector string with each element's ID and CSS class.
 * 
 * It also checks to see whether any part of the CSS path matches multiple elements, or if
 * any element has no ID or CSS class, and adds specific "nth-child" pseudo-selectors
 * where needed, eg. "p:nth-of-type(3)".
 * 
 * Hit escape key to cancel the inspector.
 * 
 * NB: XPath code removed as it didn't really work very well, need to write from scratch.
 * 
 * Started putting in IE support, but won't work in IE just yet, check back next week
 * for that (so far, tested in FF4, Chrome, Safari, Opera 11.)
 * 
 * No warranty; probably won't break the internet. Improvements and linkbacks welcome!
 */

(function(document) {
	var last;
		
	/**
	 * Get full CSS path of any element
	 *
	 * Returns a jQuery-style full CSS selector path, including IDs, classes and
	 * ":nth-of-type()" child pseudo-selectors (when required):
	 */
	function cssPath(el) {
		var cssPathStr = '',
			parents = [],
			tagName,
			cssId,
			cssClass,
			vagueMatch,
			nth,
			i,
			c,
			tagSelector;
		
		// Build array of parent nodes:
		while ( el.parentNode ) {
			parents.push( el );
			el = el.parentNode;
		}
		
		// Go down the list of parent nodes and build unique identifier for each:
		for ( i = parents.length-1; i >= 0; i-- ) {
			el = parents[i];
			vagueMatch = 0;
			
			// Get the node's tag name, ID and CSS classes:
			tagName = el.nodeName.toLowerCase();
			cssId = ( el.id ) ? ( '#' + el.id ) : false;
			cssClass = ( el.className ) ? ( '.' + el.className.replace(/ /g,".") ) : '';
			
			// Build a unique identifier for this parent node:
			if ( cssId ) {
				// Matched by ID:
				tagSelector = tagName + cssId + cssClass;
			} else if ( cssClass ) {
				// Matched by class (will be checked for multiples afterwards):
				tagSelector = tagName + cssClass;
			} else {
				// Couldn't match by ID or class, so use ":nth-child()" instead:
				vagueMatch = 1;
				tagSelector = tagName;
			}
			
			// Add this tag's CSS selector to CSS path string:
			cssPathStr += ' '+tagSelector;
			
			// If the complete/semi-complete cssPathStr matches multiple child nodes, add ":nth-child()" pseudo-selector to match:
			// NB: Only do this if element has no #id and is not <html>/<body>; 
			//     Always do this if element has no CSS class (vague match)
			if ( !tagSelector.match(/(html|body)/) && !cssId && ( vagueMatch || $( cssPathStr ).length > 1 ) ) {
				el = parents[i];
				nth = 1;
				
				// Cycle through elements siblings to match same tags for ":nth-of-type" selector:
				while ( el = el.previousElementSibling ) {
					// Is this the same type of HTML tag as the selected element?:
					if ( el.nodeName.toLowerCase() === tagName )
						nth++;
				}

				// Append nth-child pseudo-selector to CSS path:
				cssPathStr += ":nth-of-type(" + nth + ")";
			}
		}
		
		// Return full CSS path:
		return cssPathStr.replace(' ', '');
	}


	/**
	 * MouseOver action for all elements on the page:
	 */
	function inspectorMouseOver(e) {
		// NB: this doesn't work in IE (needs fix):
		var element = e.target;
		
		// Set outline:
		element.style.outline = '2px solid #f00';
		
		// Set last selected element so it can be 'deselected' on cancel.
		last = element;
	}
	
	
	/**
	 * MouseOut event action for all elements
	 */
	function inspectorMouseOut(e) {
		// Remove outline from element:
		e.target.style.outline = '';
	}
	
	
	/**
	 * Click action for hovered element
	 */
	function inspectorOnClick(e) {
		e.preventDefault();
		
		// These are the default actions (the XPath code might be a bit janky)
		// Really, these could do anything:
		console.log( cssPath(e.target) );
		/* console.log( getXPath(e.target).join('/') ); */
		
		return false;
	}


	/**
	 * Function to cancel inspector:
	 */
	function inspectorCancel(e) {
		// Unbind inspector mouse and click events:
		if (e === null && event.keyCode === 27) { // IE (won't work yet):
			document.detachEvent("mouseover", inspectorMouseOver);
			document.detachEvent("mouseout", inspectorMouseOut);
			document.detachEvent("click", inspectorOnClick);
			document.detachEvent("keydown", inspectorCancel);
			last.style.outlineStyle = 'none';
		} else if(e.which === 27) { // Better browsers:
			document.removeEventListener("mouseover", inspectorMouseOver, true);
			document.removeEventListener("mouseout", inspectorMouseOut, true);
			document.removeEventListener("click", inspectorOnClick, true);
			document.removeEventListener("keydown", inspectorCancel, true);
			
			// Remove outline on last-selected element:
			last.style.outline = 'none';
		}
	}
	

	/**
	 * Add event listeners for DOM-inspectorey actions
	 */
	if ( document.addEventListener ) {
		document.addEventListener("mouseover", inspectorMouseOver, true);
		document.addEventListener("mouseout", inspectorMouseOut, true);
		document.addEventListener("click", inspectorOnClick, true);
		document.addEventListener("keydown", inspectorCancel, true);
	} else if ( document.attachEvent ) {
		document.attachEvent("mouseover", inspectorMouseOver);
		document.attachEvent("mouseout", inspectorMouseOut);
		document.attachEvent("click", inspectorOnClick);
		document.attachEvent("keydown", inspectorCancel);
	}
	
})(document);