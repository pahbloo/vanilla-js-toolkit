---
title: "childrenMatches.js"
date: 2018-01-24T12:16:26-05:00
draft: false
description: "Get all direct descendant elements that match a selector."
how: "https://gomakethings.com/getting-direct-descendant-elements-by-selector-with-vanilla-js/"
demo: "https://codepen.io/cferdinandi/pen/qJGLyy"
polyfills: "[Requires the `Element.matches()` polyfill](https://vanillajstoolkit.com/polyfills/matches/)"
weight: 10
noIndex: false
---

```js
/*!
 * Get all direct descendant elements that match a selector
 * Dependency: the matches() polyfill: https://vanillajstoolkit.com/polyfills/matches/
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   elem     The element to get direct descendants for
 * @param  {String} selector The selector to match against
 * @return {Array}           The matching direct descendants
 */
var childrenMatches = function (elem, selector) {
	return Array.prototype.filter.call(elem.children, function (child) {
		return child.matches(selector);
	});
};
```