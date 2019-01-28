/*!
 * vanillajs v1.5.0
 * The theme for vanillajstoolkit.com
 * (c) 2019 Chris Ferdinandi
 * MIT License
 * http://github.com/cferdinandi/vanilla-js-toolkit
 */

/**
 * Element.matches() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
var api = function () {

	'use strict';

	//
	// Variables
	//

	var ctas = document.querySelectorAll('[data-cta]');
	var testimonials = document.querySelectorAll('[data-testimonial]');
	var prices = document.querySelectorAll('[data-price]');


	//
	// Methods
	//

	/**
	 * Sanitize the API data to prevent XSS attacks
	 * @return {String} The content
	 */
	var sanitize = function () {
		var temp = document.createElement('div');
		temp.textContent = str;
		return temp.innerHTML;
	};

	/**
	 * Render testimonial into the DOM
	 * @param  {Node} node   The node to render HTML into
	 * @param  {Object} data The testimonial data
	 */
	var renderTestimonial = function (node, data) {
		var noPhoto = node.getAttribute('data-no-photo');
		if (noPhoto) {
			node.innerHTML =
				'<blockquote>' +
					data.quote +
					(data.url ? '<cite>- <a href="' + data.url + '">' + data.name + '</a></cite>' : '<cite>- ' + data.name + '</cite>') +
				'</blockquote>';
		} else {
			node.innerHTML =
				'<div class="row">' +
					'<div class="grid-third">' +
						'<img class="aligncenter margin-bottom-small img-circle" height="150" width="150" src="https://gomakethings.com' + data.photo + '">' +
					'</div>' +
					'<div class="grid-two-thirds">' +
						'<blockquote>' +
							data.quote +
							(data.url ? '<cite>- <a href="' + data.url + '">' + data.name + '</a></cite>' : '<cite>- ' + data.name + '</cite>') +
						'</blockquote>' +
					'</div>' +
				'</div>';
		}
	};

	/**
	 * Render a call-to-action into the DOM
	 * @param  {Node}   node The node to render the HTML into
	 * @param  {Object} data The call-to-action data
	 */
	var renderCTA = function (node, data) {
		node.innerHTML = data;
	};

	/**
	 * Render sale pricing into the DOM
	 * @param  {Node}   node The node to render the HTML into
	 * @param  {Object} data The pricing data
	 * @param  {String} id   The ID of the price
	 */
	var renderPrice = function (node, data, id) {

		// Get the product type
		var product = node.getAttribute('data-product');
		if (!product) return;

		// Get the price
		// var priceID = id === 'guide-individual' && data['guides-all'] ? data['guides-all'][product] : data[id][product];
		var price = id === 'guide-individual' && data['guides-all'] ? data['guides-all'] : data[id];
		if (!price) return;
		if (!price[product] || price[product].length < 1) return;

		// Update the price
		node.innerHTML = price[product];

	};

	/**
	 * Render the API data into the DOM
	 * @param  {NodesList} nodes The elements to render data into
	 * @param  {Object}    data  The API data
	 * @param  {String}    type  The type of data to process
	 */
	var render = function (nodes, data, type) {
		for (var i = 0; i < nodes.length; i++) {

			// Get the content ID
			var id = nodes[i].getAttribute('data-' + type);
			if (!id || (type !== 'price' && !data[id])) continue;

			// Render data into the DOM
			if (type === 'price') {
				renderPrice(nodes[i], data, id);
			} else if (type === 'cta') {
				renderCTA(nodes[i], data[id]);
			} else {
				renderTestimonial(nodes[i], data[id]);
			}

		}
	};

	/**
	 * Process the API data
	 * @param  {Object} data The API data
	 */
	var process = function (data, store) {

		// Store to session storage
		if (store) {
			sessionStorage.setItem('gmt-api-data', data);
		}

		// Convert the stringified data to JSON
		var data = JSON.parse(data);

		// Render the data into the DOM
		render(ctas, data['ctas'], 'cta');
		render(testimonials, data['testimonials'], 'testimonial');
		render(prices, data['prices'], 'price');

	};

	/**
	 * Get data from the GMT API
	 * @param  {String} url The JSON file URL
	 */
	var getAPI = function (url) {

		// Check sessionStorage first
		var session = sessionStorage.getItem('gmt-api-data');
		if (session) {
			process(session);
			return;
		}

		// Set up our HTTP request
		var xhr = new XMLHttpRequest();

		// Setup our listener to process compeleted requests
		xhr.onreadystatechange = function () {

			// Only run if the request is complete
			if (xhr.readyState !== 4) return;

			// Process our return data
			if (xhr.status === 200) {
				process(xhr.responseText, true);
			}

		};

		// Create and send a GET request
		// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
		// The second argument is the endpoint URL
		xhr.open('GET', url);
		xhr.send();

	};


	//
	// Inits
	//

	if (ctas.length < 1 && testimonials.length < 1 && prices.length < 1) return;
	getAPI('https://gomakethings.com/api/data.json');

};
/*! fluidvids.js v2.4.1 | (c) 2014 @toddmotto | https://github.com/toddmotto/fluidvids */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.fluidvids = factory();
  }
})(this, (function () {

  'use strict';

  var fluidvids = {
    selector: ['iframe'],
    players: ['www.youtube.com', 'player.vimeo.com']
  };

  var css = [
    '.fluidvids {',
      'width: 100%; max-width: 100%; position: relative;',
    '}',
    '.fluidvids-item {',
      'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;',
    '}'
  ].join('');

  var head = document.head || document.getElementsByTagName('head')[0];

  var matches = function (src) {
    return new RegExp('^(https?:)?\/\/(?:' + fluidvids.players.join('|') + ').*$', 'i').test(src);
  };

  var getRatio = function (height, width) {
    return ((parseInt(height, 10) / parseInt(width, 10)) * 100) + '%';
  };

  var fluid = function (elem) {
    if (!matches(elem.src) || !!elem.getAttribute('data-fluidvids')) return;
    var wrap = document.createElement('div');
    elem.parentNode.insertBefore(wrap, elem);
    elem.className += (elem.className ? ' ' : '') + 'fluidvids-item';
    elem.setAttribute('data-fluidvids', 'loaded');
    wrap.className += 'fluidvids';
    wrap.style.paddingTop = getRatio(elem.height, elem.width);
    wrap.appendChild(elem);
  };

  var addStyles = function () {
    var div = document.createElement('div');
    div.innerHTML = '<p>x</p><style>' + css + '</style>';
    head.appendChild(div.childNodes[1]);
  };

  fluidvids.render = function () {
    var nodes = document.querySelectorAll(fluidvids.selector.join());
    var i = nodes.length;
    while (i--) {
      fluid(nodes[i]);
    }
  };

  fluidvids.init = function (obj) {
    for (var key in obj) {
      fluidvids[key] = obj[key];
    }
    fluidvids.render();
    addStyles();
  };

  return fluidvids;

}));
/**
 * Add links to headings
 * @param {String} selector The headings to get in the DOM (uses querySelectorAll)
 * @param {String} content  The content to add to the anchor link [default: #]
 * @param {String} styles   The class(es) to add to the link [default: anchor-link]
 */
var addHeadingLinks = function (selector, content, styles) {

	'use strict';

	// Make sure a selector was provided
	if (!selector) return;

	// Variables
	var headings = document.querySelectorAll(selector);
	content = content || '#';
	styles = styles || 'anchor-link';

	// Loop through each heading and add an anchor link
	for (var i = 0; i < headings.length; i++) {
		if (!headings[i].id) continue;
		headings[i].innerHTML += ' <a class="' + styles + '" href="#' + headings[i].id + '">' + content + '</a>';
	}

};
var mailchimp = function (callback) {

	'use strict';


	//
	// Variables
	//

	// Fields
	var form = document.querySelector('#mailchimp-form');
	if (!form) return;
	var email = form.querySelector('#mailchimp-email');
	if (!email) return;
	var status = form.querySelector('#mc-status');

	// Messages
	var messages = {
		empty: 'Please provide an email address.',
		notEmail: 'Please use a valid email address.',
		success: 'Success! Thanks for inviting me to your inbox.'
	};

	// Endpoint
	var endpoint = 'https://gomakethings.com/checkout/wp-json/gmt-mailchimp/v1/subscribe';


	//
	// Methods
	//

	/**
	 * Serialize the form data into a query string
	 * https://stackoverflow.com/a/30153391/1293256
	 * @param  {Node}   form The form to serialize
	 * @return {String}      The serialized form data
	 */
	var serialize = function (form) {

		// Setup our serialized data
		var serialized = [];

		// Loop through each field in the form
		for (var i = 0; i < form.elements.length; i++) {

			var field = form.elements[i];

			// Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
			if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

			// Convert field data to a query string
			if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
				serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
			}
		}

		return serialized.join('&');

	};

	var clearStatus = function () {

		// Bail if there's no status container
		if (!status) return;

		// Wipe classes and HTML from the status
		status.textContent = '';
		status.className = '';

		// Wipe classes and aria labels from the email field
		email.className = '';
		email.removeAttribute('aria-describedby');

	};

	var showStatus = function (msg, success) {

		// Bail if there's no status container
		if (!status) return;

		// Update the status message
		status.textContent = msg;

		// Set status class
		if (success) {
			status.className = 'success-message';
			status.setAttribute('tabindex', '-1');
			status.focus();
		} else {
			status.className = 'error-message';
			email.className = 'error';
			email.setAttribute('aria-describedby', 'mc-status');
			email.focus();
		}

	};

	var disableButton = function () {
		var btn = form.querySelector('[data-processing]');
		if (!btn) return;
		btn.setAttribute('data-original', btn.innerHTML);
		btn.setAttribute('disabled', 'disabled');
		btn.innerHTML = btn.getAttribute('data-processing');
	};

	var enableButton = function () {
		var btn = form.querySelector('[data-processing]');
		if (!btn) return;
		btn.removeAttribute('disabled');
		btn.innerHTML = btn.getAttribute('data-original');
	};

	var sendData = function (params) {

		// Set up our HTTP request
		var xhr = new XMLHttpRequest();

		// Setup our listener to process compeleted requests
		xhr.onreadystatechange = function () {

			// Only run if the request is complete
			if ( xhr.readyState !== 4 ) return;

			// Show status message
			var success = xhr.status === 200 ? true : false;
			var response = JSON.parse(xhr.responseText);
			if (success) {
				showStatus(messages.success, success);
			} else {
				showStatus(response.message, success);
			}

			// Reenable button
			enableButton();

			// If there's a callback, run it
			if (callback && typeof callback === 'function') {
				callback(response);
			}

		};

		// Create and send a GET request
		// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
		// The second argument is the endpoint URL
		xhr.open('POST', endpoint + '?' + params);
		xhr.send();

	};

	// Submit the form
	var submitForm = function () {

		// Disable the submit button
		disableButton();

		// Send the data to the MailChimp API
		sendData(serialize(form));

	};

	var isEmail = function () {
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(email.value);
	};

	var validate = function () {

		// If no email is provided
		if (email.value.length < 1) {
			showStatus(messages.empty);
			return false;
		}

		// If email is not valid
		if (!isEmail()) {
			showStatus(messages.notEmail);
			return false;
		}

		return true;

	};

	var submitHandler = function (event) {

		// Stop form from submitting
		event.preventDefault();

		// Clear the status
		clearStatus();

		// Validate email
		var valid = validate();

		if (valid) {
			submitForm();
		}

	};


	//
	// Event Listeners & Inits
	//

	form.addEventListener('submit', submitHandler, false);

};
/**
 * Generate a table of contents from headings
 * @param  {String} navSelector      Selector for the nav container
 * @param  {String} headingsSelector Selector for the headings
 * @param  {String} heading          The table of contents heading
 * @param  {String} styles           Any classes to add to the list nav
 * @param  {String} type             The list type (ul/ol)
 */
var tableOfContents = function (navSelector, headingsSelector, heading, styles, type) {

	'use strict';

	// Make sure a selector was provided
	if (!navSelector || !headingsSelector) return;

	// Get the nav
	var nav = document.querySelector(navSelector);
	if (!nav) return;

	// Variables
	var headings = document.querySelectorAll(headingsSelector);
	type = type || 'ul';
	var navList = '';

	// Loop through each heading
	for (var i = 0; i < headings.length; i++) {
		if (!headings[i].id) continue;
		navList += '<li><a href="#' + headings[i].id + '">' + headings[i].innerHTML + '</a></li>';
	}

	// Make sure a navList exists
	if (navList.length < 1) return;

	nav.innerHTML =
		(heading ? heading : '') +
		'<' + type + (styles ? ' class="' + styles + '"' : '') + '>' +
			navList +
		'</' + type + '>';

};
/**
 * Script initializations
 */

// Responsive iframe videos
fluidvids.init({
	selector: ['iframe', 'object'],
	players: ['www.youtube.com', 'player.vimeo.com', 'www.slideshare.net', 'www.hulu.com', 'videopress.com/embed/']
});

// Mailchimp form
if (document.querySelector('#mailchimp-form')) {
	mailchimp((function (data) {
		if (data.code === 200) {
			window.location.href = 'https://gomakethings.com/newsletter-success';
		}
	}));
}

// Add table of contents
if (document.querySelector('#table-of-contents')) {
	tableOfContents('#table-of-contents', 'h2', '<h2>Table of Contents</h2>', null, 'ol');
}

// Anchor links on posts
if (document.body.matches('.js-anchors')) {
	addHeadingLinks('h2, h3, h4, h5, h6', '#', 'link-no-underline');
}

// API for CTAs
api();