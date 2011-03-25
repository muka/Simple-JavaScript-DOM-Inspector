/**
 * Simple JavaScript DOM Inspector v0.0.1 - Joss Crowcroft
 *
 * Hacked together in 20 minutes so no guarantees it'll work, but putting it in a repo as I think it could become quite useful with some tidying up!
 * Default functionality is to highlight elements with a 2px red outline, and alert out the element's XPath on click. 
 * 
 * Could be configured to display a Sizzle/jQuery selector instead of XPath, or to do pretty much anything.
 *
 * Started putting in IE support, but won't work in IE just yet, check back next week for that (so far, tested in FF4, Chrome, Safari, Opera 11)
 */

(function(d) {
    var last;
	
	// XPath finder (modified from http://snippets.dzone.com/posts/show/4349)
	// JSHinted, but not double-checked for coolness or accuracy (yet):
	function getXPath(node, path) {
		path = path || [];
		var count, sibling;
		if(node.parentNode) {
			path = getXPath(node.parentNode, path);
		}
		if(node.previousSibling) {
			count = 1;
			sibling = node.previousSibling;
			do {
				if(sibling.nodeType === 1 && sibling.nodeName === node.nodeName) {
					count++;
				}
				sibling = sibling.previousSibling;
			} while(sibling);
			if(count === 1) {
				count = null;
			}
		} else if(node.nextSibling) {
			sibling = node.nextSibling;
			do {
				if(sibling.nodeType === 1 && sibling.nodeName === node.nodeName) {
					count = 1;
					sibling = null;
				} else {
					count = null;
					sibling = sibling.previousSibling;
				}
			} while(sibling);
		}
		if(node.nodeType === 1) {
			path.push(node.nodeName.toLowerCase() + (node.id ? "[@id='"+node.id+"']" : count > 0 ? "["+count+"]" : ''));
		}
		return path;
	}
	
	// Mouseover any element, this happens:
	function inspectorMouseOver(e) {
		var element = e.target; // NB: not IE (needs fix)
		
		element.style.outlineWidth = '2px';
		element.style.outlineStyle = 'solid';
		element.style.outlineColor = '#f00';
		
		last = element;
	}
	
	// Mouseout of any element, do this:
	function inspectorMouseOut(e) {
		e.target.style.outlineStyle = 'none';
	}
	
	// Clicked something? You know what to do:
	function inspectorOnClick(e) {
		e.preventDefault();
	
		/* Maybe: 
			var selection = e.target.innerHTML;
			alert('Element: ' + evt.target.toString() + '\n\nSelection:\n\n' + selection); 
		*/
		
		alert( 'xpath: '+ getXPath( e.target ) );
		return false;
	}
	
	// Function to cancel inspector:
	function inspectorCancel( e ) {
		if (e === null && event.keyCode === 27) { // IE (won't work yet):
			d.detachEvent("mouseover", inspectorMouseOver);
			d.detachEvent("mouseout", inspectorMouseOut);
			d.detachEvent("click", inspectorOnClick);
			d.detachEvent("keydown", inspectorCancel);
			last.style.outlineStyle = 'none';
		} else if(e.which === 27) { // Better browsers:
			d.removeEventListener("mouseover", inspectorMouseOver, true);
			d.removeEventListener("mouseout", inspectorMouseOut, true);
			d.removeEventListener("click", inspectorOnClick, true);
			d.removeEventListener("keydown", inspectorCancel, true);
			
			// Remove outline on last-selected element:
			last.style.outlineStyle = 'none';
		}
	}
	
	
	// Add event listeners for DOM-inspectorey actions
	if ( d.addEventListener ) {
		d.addEventListener("mouseover", inspectorMouseOver, true);
		d.addEventListener("mouseout", inspectorMouseOut, true);
		d.addEventListener("click", inspectorOnClick, true);
		d.addEventListener("keydown", inspectorCancel, true);
	} else if ( d.attachEvent ) {
		d.attachEvent("mouseover", inspectorMouseOver);
		d.attachEvent("mouseout", inspectorMouseOut);
		d.attachEvent("click", inspectorOnClick);
		d.attachEvent("keydown", inspectorCancel);
	}
	
})(document);