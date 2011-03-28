/**
 * Simple JavaScript DOM Inspector v0.1.1
 *
 * Highlights hovered elements with a 2px red outline, and then logs the element's full 
 * CSS selector path when clicked. It could also display the selected element's XPath,
 * or do pretty much anything with it in the callback function.
 * 
 * The CSS selector path-building code tries to be as specific as possible, but can also
 * build a more optimised CSS selector, stopping at the first parent with a specific ID.
 * 
 * It also checks to see whether any part of the CSS path matches multiple elements, or if
 * any element has no ID or CSS class, and adds specific "nth-child" pseudo-selectors
 * where needed for full CSS paths, eg. "html body #content p img:nth-child(1)"
 * 
 * Hit escape key to cancel the inspector.
 * 
 * NB: XPath code removed as it didn't really work very well, need to write from scratch.
 * 
 * Started putting in IE support, but won't work in IE just yet, check back next week
 * for that (so far, tested in FF4, Chrome, Safari, Opera 11.)
 * 
 * No warranty; probably won't break the internet. Improvements and linkbacks welcome!
 * 
 * - Joss
 */

(function(document) {
	var last;
		
	/**
	 * Get full CSS path of any element
	 * 
	 * Returns a jQuery-style CSS path, with IDs, classes and ':nth-child' pseudo-selectors.
	 * 
	 * Can either build a full CSS path, from 'html' all the way to ':nth-child()', or a
	 * more optimised short path, stopping at the first parent with a specific ID,
	 * eg. "#content .top p" instead of "html body #main #content .top p:nth-child(3)"
	 */
	function cssPath(el) {
		var fullPath = 1, // whether to go ultra-specific or not (more vague but still accurate CSS path)
			cssPathStr = '',
			testPath = '',
			parents = [],
			parentSelectors = [],
			tagName,
			cssId,
			cssClass,
			vagueMatch,
			nth,
			i,
			c,
			tagSelector;
		
		// Build array of parent elements:
		while ( el.parentNode ) {
			parents.push( el );
			el = el.parentNode;
		}
		
		// Go down the list of parent nodes and build unique identifier for each:
		for ( i = parents.length-1; i >=0; i-- ) {
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
			
			// Add this tag's CSS selector to the temporary CSS path string for testing:
			testPath = testPath + ' ' + tagSelector;
			
			// If doing full CSS path, and there's no ID, and this isn't the HTML/body tag...
			if ( fullPath && !cssId && !tagSelector.match(/(html|body)/) ) {
				
				// Check to see if this semi-complete CSS path matches multiple elements, add ":nth-child()" if needed:
				// NB: also add ":nth-child()" if this tagSelector is vague (no CSS class):
				if ( vagueMatch == 1 || $( testPath ).length > 1 ) {
					
					// Count element's previous siblings for ":nth-child" pseudo-selector:
					for ( nth = 1, c = el; c.previousElementSibling; c = c.previousElementSibling, nth++ );
					
					// Append nth-child pseudo-selector to CSS path:
					tagSelector += ":nth-child(" + nth + ")";
				}
			}
			
			// Add this full tag selector to the parentSelectors array:
			parentSelectors.unshift( tagSelector );
		}
		
		// Build the CSS path string from the parent tag selectors:
		for ( i = 0; i < parentSelectors.length; i++ ) {
			cssPathStr = parentSelectors[i] + ' ' + cssPathStr;
			
			// Stop at first ID, if not doing full path:
			if ( !fullPath && parentSelectors[i].match('#') )
				break;
		}
		
		// Return trimmed full CSS path:
		return cssPathStr.replace(/^[ \t]+|[ \t]+$/, '');
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