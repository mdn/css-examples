'use strict';

/**
 * UI-SlidersManager
 */

var SliderManager = (function SliderManager() {

	var subscribers = {};
	var sliders = [];

	var Slider = function(node) {
		var min = node.getAttribute('data-min') | 0;
		var max = node.getAttribute('data-max') | 0;
		var step = node.getAttribute('data-step') | 0;
		var value = node.getAttribute('data-value') | 0;
		var snap = node.getAttribute('data-snap');
		var topic = node.getAttribute('data-topic');

		this.min = min;
		this.max = max > 0 ? max : 100;
		this.step = step === 0 ? 1 : step;
		this.value = value <= max && value >= min ? value : (min + max) / 2 | 0;
		this.snap = snap === "true" ? true : false;
		this.topic = topic;
		this.node = node;

		var pointer = document.createElement('div');
		pointer.className = 'ui-slider-pointer';
		node.appendChild(pointer);
		this.pointer = pointer;

		setMouseTracking(node, updateSlider.bind(this));

		sliders[topic] = this;
		setValue(topic, this.value);
	}

	var setButtonComponent = function setButtonComponent(node) {
		var type = node.getAttribute('data-type');
		var topic = node.getAttribute('data-topic');
		if (type === "sub") {
			node.textContent = '-';
			node.addEventListener("click", function() {
				decrement(topic);
			});
		}
		if (type === "add") {
			node.textContent = '+';
			node.addEventListener("click", function() {
				increment(topic);
			});
		}
	}

	var setInputComponent = function setInputComponent(node) {
		var topic		= node.getAttribute('data-topic');
		var unit_type	= node.getAttribute('data-unit');

		var input = document.createElement('input');
		var unit = document.createElement('span');
		unit.textContent = unit_type;

		input.setAttribute('type', 'text');
		node.appendChild(input);
		node.appendChild(unit);

		input.addEventListener('click', function(e) {
			this.select();
		});

		input.addEventListener('change', function(e) {
			setValue(topic, e.target.value | 0);
		});

		subscribe(topic, function(value) {
			node.children[0].value = value;
		});
	}

	var increment = function increment(topic) {
		var slider = sliders[topic];
		if (slider === null || slider === undefined)
			return;

		if (slider.value + slider.step <= slider.max) {
			slider.value += slider.step;
			setValue(slider.topic, slider.value)
			notify.call(slider);
		}
	};

	var decrement = function decrement(topic) {
		var slider = sliders[topic];
		if (slider === null || slider === undefined)
			return;

		if (slider.value - slider.step >= slider.min) {
			slider.value -= slider.step;
			setValue(topic, slider.value)
			notify.call(slider);
		}
	}

	// this = Slider object
	var updateSlider = function updateSlider(e) {
		var node = this.node;
		var pos = e.pageX - node.offsetLeft;
		var width = node.clientWidth;
		var delta = this.max - this.min;
		var offset = this.pointer.clientWidth + 4; // border width * 2

		if (pos < 0) pos = 0;
		if (pos > width) pos = width;

		var value = pos * delta / width | 0;
		var precision = value % this.step;
		value = value - precision + this.min;
		if (precision > this.step / 2)
			value = value + this.step;

		if (this.snap)
			pos =  (value - this.min) * width / delta;

		this.pointer.style.left = pos - offset/2 + "px";
		this.value = value;
		node.setAttribute('data-value', value);
		notify.call(this);
	}

	var setValue = function setValue(topic, value) {
		var slider = sliders[topic];

		if (value > slider.max || value < slider.min)
			return;

		var delta = slider.max - slider.min;
		var width = slider.node.clientWidth;
		var offset = slider.pointer.clientWidth;
		var pos =  (value - slider.min) * width / delta;
		slider.value = value;
		slider.pointer.style.left = pos - offset / 2 + "px";
		slider.node.setAttribute('data-value', value);
		notify.call(slider);
	}

	var setMouseTracking = function setMouseTracking(elem, callback) {
		elem.addEventListener("mousedown", function(e) {
			callback(e);
			document.addEventListener("mousemove", callback);
		});

		document.addEventListener("mouseup", function(e) {
			document.removeEventListener("mousemove", callback);
		});
	}

	var subscribe = function subscribe(topic, callback) {
		if (subscribers[topic] === undefined)
			subscribers[topic] = [];
		subscribers[topic].push(callback);
	}

	var unsubscribe = function unsubscribe(topic, callback) {
		subscribers[topic].indexOf(callback);
		subscribers[topic].splice(index, 1);
	}

	var notify = function notify() {
		if (subscribers[this.topic] === undefined)
			return;

		for (var i in subscribers[this.topic]) {
			subscribers[this.topic][i](this.value);
		}
	}

	var init = function init() {
		var elem, size;

		elem = document.querySelectorAll('.ui-slider-btn-set');
		size = elem.length;
		for (var i = 0; i < size; i++)
			setButtonComponent(elem[i]);

		elem = document.querySelectorAll('.ui-slider-input');
		size = elem.length;
		for (var i = 0; i < size; i++)
			setInputComponent(elem[i]);

		elem = document.querySelectorAll('.ui-slider');
		size = elem.length;
		for (var i = 0; i < size; i++)
			new Slider(elem[i]);
	}

	return {
		init : init,
		setValue : setValue,
		subscribe : subscribe,
		unsubscribe : unsubscribe
	}

})();

/**
 * UI-ButtonManager
 */

var ButtonManager = (function CheckBoxManager() {

	var subscribers = [];
	var buttons = [];

	var CheckBox = function CheckBox(node) {
		var topic = node.getAttribute('data-topic');
		var state = node.getAttribute('data-state');
		var name = node.getAttribute('data-label');
		var align = node.getAttribute('data-text-on');

		state = (state === "true");

		var checkbox = document.createElement("input");
		var label = document.createElement("label");

		var id = 'checkbox-' + topic;
		checkbox.id = id;
		checkbox.setAttribute('type', 'checkbox');
		checkbox.checked = state;

		label.setAttribute('for', id);
		if (name) {
			label.className = 'text';
			if (align)
				label.className += ' ' + align;
			label.textContent = name;
		}

		node.appendChild(checkbox);
		node.appendChild(label);

		this.node = node;
		this.topic = topic;
		this.checkbox = checkbox;

		checkbox.addEventListener('change', function(e) {
			notify.call(this);
		}.bind(this));

		buttons[topic] = this;
	}

	var getNode =  function getNode(topic) {
		return buttons[topic].node;
	}

	var setValue = function setValue(topic, value) {
		try {
			buttons[topic].checkbox.checked = value;
			notify.call(buttons[topic]);
		}
		catch(error) {
			console.log(error, topic, value);
		}
	}

	var subscribe = function subscribe(topic, callback) {
		if (subscribers[topic] === undefined)
			subscribers[topic] = [];

		subscribers[topic].push(callback);
	}

	var unsubscribe = function unsubscribe(topic, callback) {
		subscribers[topic].indexOf(callback);
		subscribers[topic].splice(index, 1);
	}

	var notify = function notify() {
		if (subscribers[this.topic] === undefined)
			return;
		for (var i = 0; i < subscribers[this.topic].length; i++)
			subscribers[this.topic][i](this.checkbox.checked);
	}

	var init = function init() {
		var elem = document.querySelectorAll('.ui-checkbox');
		var size = elem.length;
		for (var i = 0; i < size; i++)
			new CheckBox(elem[i]);
	}

	return {
		init : init,
		setValue : setValue,
		subscribe : subscribe,
		unsubscribe : unsubscribe
	}

})();

window.addEventListener("load", function(){
	BoxShadow.init();
});

var BoxShadow = (function BoxShadow() {

	function getElemById(id) {
		return document.getElementById(id);
	}

	/**
	 * RGBA Color class
	 */

	function Color() {
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 1;
		this.hue = 0;
		this.saturation = 0;
		this.value = 0;
	}

	Color.prototype.copy = function copy(obj) {
		if(obj instanceof Color !== true) {
			console.log("Typeof instance not Color");
			return;
		}

		this.r = obj.r;
		this.g = obj.g;
		this.b = obj.b;
		this.a = obj.a;
		this.hue = obj.hue;
		this.saturation = obj.saturation;
		this.value = obj.value;
	}

	Color.prototype.setRGBA = function setRGBA(red, green, blue, alpha) {
		if (red != undefined)
			this.r = red | 0;
		if (green != undefined)
			this.g = green | 0;
		if (blue != undefined)
			this.b = blue | 0;
		if (alpha != undefined)
			this.a = alpha | 0;
	}

	/**
	 * HSV/HSB (hue, saturation, value / brightness)
	 * @param hue			0-360
	 * @param saturation	0-100
	 * @param value 		0-100
	 */
	Color.prototype.setHSV = function setHSV(hue, saturation, value) {
		this.hue = hue;
		this.saturation = saturation;
		this.value = value;
		this.updateRGB();
	}

	Color.prototype.updateRGB = function updateRGB() {
		var sat = this.saturation / 100;
		var value = this.value / 100;
		var C = sat * value;
		var H = this.hue / 60;
		var X = C * (1 - Math.abs(H % 2 - 1));
		var m = value - C;
		var precision = 255;

		C = (C + m) * precision;
		X = (X + m) * precision;
		m = m * precision;

		if (H >= 0 && H < 1) {	this.setRGBA(C, X, m);	return; }
		if (H >= 1 && H < 2) {	this.setRGBA(X, C, m);	return; }
		if (H >= 2 && H < 3) {	this.setRGBA(m, C, X);	return; }
		if (H >= 3 && H < 4) {	this.setRGBA(m, X, C);	return; }
		if (H >= 4 && H < 5) {	this.setRGBA(X, m, C);	return; }
		if (H >= 5 && H < 6) {	this.setRGBA(C, m, X);	return; }
	}

	Color.prototype.updateHSV = function updateHSV() {
		var red		= this.r / 255;
		var green	= this.g / 255;
		var blue	= this.b / 255;

		var cmax = Math.max(red, green, blue);
		var cmin = Math.min(red, green, blue);
		var delta = cmax - cmin;
		var hue = 0;
		var saturation = 0;

		if (delta) {
			if (cmax === red ) { hue = ((green - blue) / delta); }
			if (cmax === green ) { hue = 2 + (blue - red) / delta; }
			if (cmax === blue ) { hue = 4 + (red - green) / delta; }
			if (cmax) saturation = delta / cmax;
		}

		this.hue = 60 * hue | 0;
		if (this.hue < 0) this.hue += 360;
		this.saturation = (saturation * 100) | 0;
		this.value = (cmax * 100) | 0;
	}

	Color.prototype.setHexa = function setHexa(value) {
		var valid  = /(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)/i.test(value)
		if (valid !== true)
			return;

		if (value[0] === '#')
			value = value.slice(1, value.length);

		if (value.length === 3)
			value = value.replace(/([0-9A-F])([0-9A-F])([0-9A-F])/i,"$1$1$2$2$3$3");

		this.r = parseInt(value.substr(0, 2), 16);
		this.g = parseInt(value.substr(2, 2), 16);
		this.b = parseInt(value.substr(4, 2), 16);

		this.alpha	= 1;
	}

	Color.prototype.getHexa = function getHexa() {
		var r = this.r.toString(16);
		var g = this.g.toString(16);
		var b = this.b.toString(16);
		if (this.r < 16) r = '0' + r;
		if (this.g < 16) g = '0' + g;
		if (this.b < 16) b = '0' + b;
		var value = '#' + r + g + b;
		return value.toUpperCase();
	}

	Color.prototype.getRGBA = function getRGBA() {

		var rgb = "(" + this.r + ", " + this.g + ", " + this.b;
		var a = '';
		var v = '';
		if (this.a !== 1) {
			a = 'a';
			v = ', ' + this.a;
		}

		var value = "rgb" + a + rgb + v + ")";
		return value;
	}

	Color.prototype.getColor = function getColor() {
		if (this.a | 0 === 1)
			return this.getHexa();
		return this.getRGBA();
	}

	/**
	 * Shadow Object
	 */
	function Shadow() {
		this.inset  = false;
		this.posX   = 5;
		this.posY   = -5;
		this.blur   = 5;
		this.spread = 0;
		this.color  = new Color();

		var hue			= (Math.random() * 360) | 0;
		var saturation	= (Math.random() * 75) | 0;
		var value 		= (Math.random() * 50 + 50) | 0;
		this.color.setHSV(hue, saturation, value, 1);
	}

	Shadow.prototype.computeCSS = function computeCSS() {
		var value = "";
		if (this.inset === true)
			value += "inset ";
		value += this.posX + "px ";
		value += this.posY + "px ";
		value += this.blur + "px ";
		value += this.spread + "px ";
		value += this.color.getColor();

		return value;
	}

	Shadow.prototype.toggleInset = function toggleInset(value) {
		if (value !== undefined || typeof value === "boolean")
			this.inset = value;
		else
			this.inset = this.inset === true ? false : true;
	}

	Shadow.prototype.copy = function copy(obj) {
		if(obj instanceof Shadow !== true) {
			console.log("Typeof instance not Shadow");
			return;
		}

		this.inset  = obj.inset;
		this.posX   = obj.posX;
		this.posY   = obj.posY;
		this.blur   = obj.blur;
		this.spread = obj.spread;
		this.color.copy(obj.color);
	}

	/**
	 * Color Picker
	 */
	var ColoPicker = (function ColoPicker() {

		var colorpicker;
		var hue_area;
		var gradient_area;
		var alpha_area;
		var gradient_picker;
		var hue_selector;
		var alpha_selector;
		var pick_object;
		var info_rgb;
		var info_hsv;
		var info_hexa;
		var output_color;
		var color = new Color();
		var subscribers = [];

		var updateColor = function updateColor(e) {
			var x = e.pageX - gradient_area.offsetLeft;
			var y = e.pageY - gradient_area.offsetTop;

			// width and height should be the same
			var size = gradient_area.clientWidth;

			if (x > size)
				x = size;
			if (y > size)
				y = size;

			if (x < 0) x = 0;
			if (y < 0) y = 0;

			var value = 100 - (y * 100 / size) | 0;
			var saturation = x * 100 / size | 0;

			color.setHSV(color.hue, saturation, value);
			// should update just
			// color pointer location
			updateUI();
			notify("color", color);
		}

		var updateHue = function updateHue(e) {
			var x = e.pageX - hue_area.offsetLeft;
			var width = hue_area.clientWidth;

			if (x < 0) x = 0;
			if (x > width) x = width;

			var hue = ((360 * x) / width) | 0;
			if (hue === 360) hue = 359;

			color.setHSV(hue, color.saturation, color.value);

			// should update just
			// hue pointer location
			// picker area background
			// alpha area background
			updateUI();
			notify("color", color);
		}

		var updateAlpha = function updateAlpha(e) {
			var x = e.pageX - alpha_area.offsetLeft;
			var width = alpha_area.clientWidth;

			if (x < 0) x = 0;
			if (x > width) x = width;

			color.a = (x / width).toFixed(2);

			// should update just
			// alpha pointer location
			updateUI();
			notify("color", color);
		}

		var setHueGfx = function setHueGfx(hue) {
			var sat = color.saturation;
			var val = color.value;
			var alpha = color.a;

			color.setHSV(hue, 100, 100);
			gradient_area.style.backgroundColor = color.getHexa();

			color.a = 0;
			var start = color.getRGBA();
			color.a = 1;
			var end = color.getRGBA();
			color.a = alpha;

			var gradient = '-moz-linear-gradient(left, ' +	start + '0%, ' + end + ' 100%)';
			alpha_area.style.background = gradient;
		}

		var updateUI = function updateUI() {
			var x, y;		// coordinates
			var size;		// size of the area
			var offset;		// pointer graphic selector offset

			// Set color pointer location
			size = gradient_area.clientWidth;
			offset = gradient_picker.clientWidth / 2 + 2;

			x = (color.saturation * size / 100) | 0;
			y = size - (color.value * size / 100) | 0;

			gradient_picker.style.left = x - offset + "px";
			gradient_picker.style.top = y - offset + "px";

			// Set hue pointer location
			size = hue_area.clientWidth;
			offset = hue_selector.clientWidth/2;
			x = (color.hue * size / 360 ) | 0;
			hue_selector.style.left = x - offset + "px";

			// Set alpha pointer location
			size = alpha_area.clientWidth;
			offset = alpha_selector.clientWidth/2;
			x = (color.a * size) | 0;
			alpha_selector.style.left = x - offset + "px";

			// Set picker area background
			var nc = new Color();
			nc.copy(color);
			if (nc.hue === 360) nc.hue = 0;
			nc.setHSV(nc.hue, 100, 100);
			gradient_area.style.backgroundColor = nc.getHexa();

			// Set alpha area background
			nc.copy(color);
			nc.a = 0;
			var start = nc.getRGBA();
			nc.a = 1;
			var end = nc.getRGBA();
			var gradient = '-moz-linear-gradient(left, ' +	start + '0%, ' + end + ' 100%)';
			alpha_area.style.background = gradient;

			// Update color info
			notify("color", color);
			notify("hue", color.hue);
			notify("saturation", color.saturation);
			notify("value", color.value);
			notify("r", color.r);
			notify("g", color.g);
			notify("b", color.b);
			notify("a", color.a);
			notify("hexa", color.getHexa());
			output_color.style.backgroundColor = color.getRGBA();
		}

		var setInputComponent = function setInputComponent(node) {
			var topic = node.getAttribute('data-topic');
			var title = node.getAttribute('data-title');
			var action = node.getAttribute('data-action');
			title = title === null ? '' : title;

			var input = document.createElement('input');
			var info = document.createElement('span');
			info.textContent = title;

			input.setAttribute('type', 'text');
			input.setAttribute('data-action', 'set-' + action + '-' + topic);
			node.appendChild(info);
			node.appendChild(input);

			input.addEventListener('click', function(e) {
				this.select();
			});

			input.addEventListener('change', function(e) {
				if (action === 'HSV')
					inputChangeHSV(topic);
				if (action === 'RGB')
					inputChangeRGB(topic);
				if (action === 'alpha')
					inputChangeAlpha(topic);
				if (action === 'hexa')
					inputChangeHexa(topic);
			});

			subscribe(topic, function(value) {
				node.children[1].value = value;
			});
		}

		var inputChangeHSV = function actionHSV(topic) {
			var selector = "[data-action='set-HSV-" + topic + "']";
			var node = document.querySelector("#colorpicker " + selector);
			var value = parseInt(node.value);

			if (typeof value === 'number' && isNaN(value) === false &&
				value >= 0 && value < 360)
				color[topic] = value;

			color.updateRGB();
			updateUI();
		}

		var inputChangeRGB = function inputChangeRGB(topic) {
			var selector = "[data-action='set-RGB-" + topic + "']";
			var node = document.querySelector("#colorpicker " + selector);
			var value = parseInt(node.value);

			if (typeof value === 'number' && isNaN(value) === false &&
				value >= 0 && value <= 255)
				color[topic] = value;

			color.updateHSV();
			updateUI();
		}

		var inputChangeAlpha = function inputChangeAlpha(topic) {
			var selector = "[data-action='set-alpha-" + topic + "']";
			var node = document.querySelector("#colorpicker " + selector);
			var value = parseFloat(node.value);

			if (typeof value === 'number' && isNaN(value) === false &&
				value >= 0 && value <= 1)
				color.a = value.toFixed(2);

			updateUI();
		}

		var inputChangeHexa = function inputChangeHexa(topic) {
			var selector = "[data-action='set-hexa-" + topic + "']";
			var node = document.querySelector("#colorpicker " + selector);
			var value = node.value;
			color.setHexa(value);
			color.updateHSV();
			updateUI();
		}

		var setMouseTracking = function setMouseTracking(elem, callback) {

			elem.addEventListener("mousedown", function(e) {
				callback(e);
				document.addEventListener("mousemove", callback);
			});

			document.addEventListener("mouseup", function(e) {
				document.removeEventListener("mousemove", callback);
			});
		}

		/*
		 * Observer
		 */
		var setColor = function setColor(obj) {
			if(obj instanceof Color !== true) {
				console.log("Typeof instance not Color");
				return;
			}
			color.copy(obj);
			updateUI();
		}

		var subscribe = function subscribe(topic, callback) {
			if (subscribers[topic] === undefined)
				subscribers[topic] = [];

			subscribers[topic].push(callback);
		}

		var unsubscribe = function unsubscribe(callback) {
			subscribers.indexOf(callback);
			subscribers.splice(index, 1);
		}

		var notify = function notify(topic, value) {
			for (var i in subscribers[topic])
				subscribers[topic][i](value);
		}

		var init = function init() {
			colorpicker		= getElemById("colorpicker");
			hue_area		= getElemById("hue");
			gradient_area	= getElemById("gradient");
			alpha_area		= getElemById("alpha");
			gradient_picker	= getElemById("gradient_picker");
			hue_selector	= getElemById("hue_selector");
			alpha_selector	= getElemById("alpha_selector");
			output_color	= getElemById("output_color");

			var elem = document.querySelectorAll('#colorpicker .input');
			var size = elem.length;
			for (var i = 0; i < size; i++)
				setInputComponent(elem[i]);

			setMouseTracking(gradient_area, updateColor);
			setMouseTracking(hue_area, updateHue);
			setMouseTracking(alpha_area, updateAlpha);

		}

		return {
			init : init,
			setColor : setColor,
			subscribe : subscribe,
			unsubscribe : unsubscribe
		}

	})();

	/**
	 * Shadow dragging
	 */
	var PreviewMouseTracking = (function Drag() {
		var active = false;
		var lastX = 0;
		var lastY = 0;
		var subscribers = [];

		var init = function init(id) {
			var elem = getElemById(id);
			elem.addEventListener('mousedown', dragStart, false);
			document.addEventListener('mouseup', dragEnd, false);
		}

		var dragStart = function dragStart(e) {
			if (e.button !== 0)
				return;

			active = true;
			lastX = e.clientX;
			lastY = e.clientY;
			document.addEventListener('mousemove', mouseDrag, false);
		}

		var dragEnd = function dragEnd(e) {
			if (e.button !== 0)
				return;

			if (active === true) {
				active = false;
				document.removeEventListener('mousemove', mouseDrag, false);
			}
		}

		var mouseDrag = function mouseDrag(e) {
			notify(e.clientX - lastX, e.clientY - lastY);
			lastX = e.clientX;
			lastY = e.clientY;
		}

		var subscribe = function subscribe(callback) {
			subscribers.push(callback);
		}

		var unsubscribe = function unsubscribe(callback) {
			var index = subscribers.indexOf(callback);
			subscribers.splice(index, 1);
		}

		var notify = function notify(deltaX, deltaY) {
			for (var i in subscribers)
				subscribers[i](deltaX, deltaY);
		}

		return {
			init : init,
			subscribe : subscribe,
			unsubscribe : unsubscribe
		}

	})();

	/*
	 * Element Class
	 */
	var CssClass = function CssClass(id) {
		this.left = 0;
		this.top = 0;
		this.rotate = 0;
		this.width = 300;
		this.height = 100;
		this.display = true;
		this.border = true;
		this.zIndex = -1;
		this.bgcolor = new Color();
		this.id = id;
		this.node = getElemById('obj-' + id);
		this.object = getElemById(id);
		this.shadowID = null;
		this.shadows = []
		this.render = [];
		this.init();
	}

	CssClass.prototype.init = function init() {
		this.left = ((this.node.parentNode.clientWidth - this.node.clientWidth) / 2) | 0;
		this.top = ((this.node.parentNode.clientHeight - this.node.clientHeight) / 2) | 0;

		this.setTop(this.top);
		this.setLeft(this.left);
		this.setHeight(this.height);
		this.setWidth(this.width);
		this.bgcolor.setHSV(0, 0, 100);
		this.updateBgColor(this.bgcolor);
	}

	CssClass.prototype.updatePos = function updatePos(deltaX, deltaY) {
		this.left += deltaX;
		this.top += deltaY;
		this.node.style.top = this.top + "px";
		this.node.style.left = this.left + "px";
		SliderManager.setValue("left", this.left);
		SliderManager.setValue("top", this.top);
	}

	CssClass.prototype.setLeft = function setLeft(value) {
		this.left = value;
		this.node.style.left = this.left + "px";
		OutputManager.updateProperty(this.id, 'left', this.left + 'px');
	}

	CssClass.prototype.setTop = function setTop(value) {
		this.top = value;
		this.node.style.top = this.top + 'px';
		OutputManager.updateProperty(this.id, 'top', this.top + 'px');
	}

	CssClass.prototype.setWidth = function setWidth(value) {
		this.width = value;
		this.node.style.width = this.width + 'px';
		OutputManager.updateProperty(this.id, 'width', this.width + 'px');
	}

	CssClass.prototype.setHeight = function setHeight(value) {
		this.height = value;
		this.node.style.height = this.height + 'px';
		OutputManager.updateProperty(this.id, 'height', this.height + 'px');
	}

	// Browser support
	CssClass.prototype.setRotate = function setRotate(value) {
		var cssvalue = 'rotate(' + value +'deg)';

		this.node.style.transform = cssvalue;
		this.node.style.webkitTransform = cssvalue;
		this.node.style.msTransform = cssvalue;

		if (value !== 0) {
			if (this.rotate === 0) {
				OutputManager.toggleProperty(this.id, 'transform', true);
				OutputManager.toggleProperty(this.id, '-webkit-transform', true);
				OutputManager.toggleProperty(this.id, '-ms-transform', true);
			}
		}
		else {
			OutputManager.toggleProperty(this.id, 'transform', false);
			OutputManager.toggleProperty(this.id, '-webkit-transform', false);
			OutputManager.toggleProperty(this.id, '-ms-transform', false);
		}

		OutputManager.updateProperty(this.id, 'transform', cssvalue);
		OutputManager.updateProperty(this.id, '-webkit-transform', cssvalue);
		OutputManager.updateProperty(this.id, '-ms-transform', cssvalue);
		this.rotate = value;
	}

	CssClass.prototype.setzIndex = function setzIndex(value) {
		this.node.style.zIndex = value;
		OutputManager.updateProperty(this.id, 'z-index', value);
		this.zIndex = value;
	}

	CssClass.prototype.toggleDisplay = function toggleDisplay(value) {
		if (typeof value !== "boolean" || this.display === value)
			return;

		this.display = value;
		var display = this.display === true ? "block" : "none";
		this.node.style.display = display;
		this.object.style.display = display;
	}

	CssClass.prototype.toggleBorder = function toggleBorder(value) {
		if (typeof value !== "boolean" || this.border === value)
			return;

		this.border = value;
		var border = this.border === true ? "1px solid #CCC" : "none";
		this.node.style.border = border;
	}

	CssClass.prototype.updateBgColor = function updateBgColor(color) {
		this.bgcolor.copy(color);
		this.node.style.backgroundColor = color.getColor();
		OutputManager.updateProperty(this.id, 'background-color', color.getColor());
	}

	CssClass.prototype.updateShadows = function updateShadows() {
		if (this.render.length === 0)
			OutputManager.toggleProperty(this.id, 'box-shadow', false);
		if (this.render.length === 1)
			OutputManager.toggleProperty(this.id, 'box-shadow', true);

		this.node.style.boxShadow = this.render.join(", ");
		OutputManager.updateProperty(this.id, 'box-shadow', this.render.join(", \n"));

	}

	/**
	 * Tool Manager
	 */
	var Tool = (function Tool() {

		var preview;
		var classes = [];
		var active = null;
		var animate = false;

		/*
		 * Toll actions
		 */
		var addCssClass = function addCssClass(id) {
			classes[id] = new CssClass(id);
		}

		var setActiveClass = function setActiveClass(id) {
			active = classes[id];
			active.shadowID = null;
			ColoPicker.setColor(classes[id].bgcolor);
			SliderManager.setValue("top", active.top);
			SliderManager.setValue("left", active.left);
			SliderManager.setValue("rotate", active.rotate);
			SliderManager.setValue("z-index", active.zIndex);
			SliderManager.setValue("width", active.width);
			SliderManager.setValue("height", active.height);
			ButtonManager.setValue("border-state", active.border);
			active.updateShadows();
		}

		var disableClass = function disableClass(topic) {
			classes[topic].toggleDisplay(false);
			ButtonManager.setValue(topic, false);
		}

		var addShadow = function addShadow(position) {
			if (animate === true)
				return -1;

			active.shadows.splice(position, 0, new Shadow());
			active.render.splice(position, 0, null);
		}

		var swapShadow = function swapShadow(id1, id2) {
			var x = active.shadows[id1];
			active.shadows[id1] = active.shadows[id2];
			active.shadows[id2] = x;
			updateShadowCSS(id1);
			updateShadowCSS(id2);
		}

		var deleteShadow = function deleteShadow(position) {
			active.shadows.splice(position, 1);
			active.render.splice(position, 1);
			active.updateShadows();
		}

		var setActiveShadow = function setActiveShadow(id, glow) {
			active.shadowID = id;
			ColoPicker.setColor(active.shadows[id].color);
			ButtonManager.setValue("inset", active.shadows[id].inset);
			SliderManager.setValue("blur", active.shadows[id].blur);
			SliderManager.setValue("spread", active.shadows[id].spread);
			SliderManager.setValue("posX", active.shadows[id].posX);
			SliderManager.setValue("posY", active.shadows[id].posY);
			if (glow === true)
				addGlowEffect(id);
		}

		var addGlowEffect = function addGlowEffect(id) {
			if (animate === true)
				return;

			animate = true;
			var store = new Shadow();
			var shadow = active.shadows[id];

			store.copy(shadow);
			shadow.color.setRGBA(40, 125, 200, 1);
			shadow.blur = 10;
			shadow.spread = 10;

			active.node.style.transition = "box-shadow 0.2s";
			updateShadowCSS(id);

			setTimeout(function() {
				shadow.copy(store);
				updateShadowCSS(id);
				setTimeout(function() {
					active.node.style.removeProperty("transition");
					animate = false;
				}, 100);
			}, 200);
		}

		var updateActivePos = function updateActivePos(deltaX, deltaY) {
			if (active.shadowID === null)
				active.updatePos(deltaX, deltaY);
			else
				updateShadowPos(deltaX, deltaY);
		}

		/*
		 * Shadow properties
		 */
		var updateShadowCSS = function updateShadowCSS(id) {
			active.render[id] = active.shadows[id].computeCSS();
			active.updateShadows();
		}

		var toggleShadowInset = function toggleShadowInset(value) {
			if (active.shadowID === null)
				return;
			active.shadows[active.shadowID].toggleInset(value);
			updateShadowCSS(active.shadowID);
		}

		var updateShadowPos = function updateShadowPos(deltaX, deltaY) {
			var shadow = active.shadows[active.shadowID];
			shadow.posX += deltaX;
			shadow.posY += deltaY;
			SliderManager.setValue("posX", shadow.posX);
			SliderManager.setValue("posY", shadow.posY);
			updateShadowCSS(active.shadowID);
		}

		var setShadowPosX = function setShadowPosX(value) {
			if (active.shadowID === null)
				return;
			active.shadows[active.shadowID].posX = value;
			updateShadowCSS(active.shadowID);
		}

		var setShadowPosY = function setShadowPosY(value) {
			if (active.shadowID === null)
				return;
			active.shadows[active.shadowID].posY = value;
			updateShadowCSS(active.shadowID);
		}

		var setShadowBlur = function setShadowBlur(value) {
			if (active.shadowID === null)
				return;
			active.shadows[active.shadowID].blur = value;
			updateShadowCSS(active.shadowID);
		}

		var setShadowSpread = function setShadowSpread(value) {
			if (active.shadowID === null)
				return;
			active.shadows[active.shadowID].spread = value;
			updateShadowCSS(active.shadowID);
		}

		var updateShadowColor = function updateShadowColor(color) {
			active.shadows[active.shadowID].color.copy(color);
			updateShadowCSS(active.shadowID);
		}

		/*
		 * Element Properties
		 */
		var updateColor = function updateColor(color) {
			if (active.shadowID === null)
				active.updateBgColor(color);
			else
				updateShadowColor(color);
		}

		var init = function init() {
			preview = getElemById("preview");

			ColoPicker.subscribe("color", updateColor);
			PreviewMouseTracking.subscribe(updateActivePos);

			// Affects shadows
			ButtonManager.subscribe("inset", toggleShadowInset);
			SliderManager.subscribe("posX", setShadowPosX);
			SliderManager.subscribe("posY", setShadowPosY);
			SliderManager.subscribe("blur", setShadowBlur);
			SliderManager.subscribe("spread", setShadowSpread);

			// Affects element
			SliderManager.subscribe("top", function(value){
				active.setTop(value);
			});
			SliderManager.subscribe("left", function(value){
				active.setLeft(value);
			});
			SliderManager.subscribe("rotate", function(value) {
				if (active == classes["element"])
					return;
				active.setRotate(value);
			});

			SliderManager.subscribe("z-index", function(value) {
				if (active == classes["element"])
					return;
				active.setzIndex(value);
			});

			SliderManager.subscribe("width", function(value) {
				active.setWidth(value)
			});

			SliderManager.subscribe("height", function(value) {
				active.setHeight(value)
			});

			// Actions
			classes['before'].top = -30;
			classes['before'].left = -30;
			classes['after'].top = 30;
			classes['after'].left = 30;
			classes['before'].toggleDisplay(false);
			classes['after'].toggleDisplay(false);
			ButtonManager.setValue('before', false);
			ButtonManager.setValue('after', false);

			ButtonManager.subscribe("before", classes['before'].toggleDisplay.bind(classes['before']));
			ButtonManager.subscribe("after", classes['after'].toggleDisplay.bind(classes['after']));

			ButtonManager.subscribe("border-state", function(value) {
				active.toggleBorder(value);
			});

		}

		return {
			init 			: init,
			addShadow		: addShadow,
			swapShadow		: swapShadow,
			addCssClass		: addCssClass,
			disableClass	: disableClass,
			deleteShadow	: deleteShadow,
			setActiveClass	: setActiveClass,
			setActiveShadow : setActiveShadow
		}

	})();

	/**
	 * Layer Manager
	 */
	var LayerManager = (function LayerManager() {
		var stacks = [];
		var active = {
			node : null,
			stack : null
		}
		var elements = {};

		var mouseEvents = function mouseEvents(e) {
			var node = e.target;
			var type = node.getAttribute('data-type');

			if (type === 'subject')
				setActiveStack(stacks[node.id]);

			if (type === 'disable') {
				Tool.disableClass(node.parentNode.id);
				setActiveStack(stacks['element']);
			}

			if (type === 'add')
				active.stack.addLayer();

			if (type === 'layer')
				active.stack.setActiveLayer(node);

			if (type === 'delete')
				active.stack.deleteLayer(node.parentNode);

			if (type === 'move-up')
				active.stack.moveLayer(1);

			if (type === 'move-down')
				active.stack.moveLayer(-1);
		}

		var setActiveStack = function setActiveStack(stackObj) {
			active.stack.hide();
			active.stack = stackObj;
			active.stack.show();
		}

		/*
		 * Stack object
		 */
		var Stack = function Stack(subject) {
			var S = document.createElement('div');
			var title = document.createElement('div');
			var stack = document.createElement('div');

			S.className = 'container';
			stack.className = 'stack';
			title.className = 'title';
			title.textContent = subject.getAttribute('data-title');
			S.appendChild(title);
			S.appendChild(stack);

			this.id = subject.id;
			this.container = S;
			this.stack = stack;
			this.subject = subject;
			this.order = [];
			this.uid = 0;
			this.count = 0;
			this.layer = null;
			this.layerID = 0;
		}

		Stack.prototype.addLayer = function addLayer() {
			if (Tool.addShadow(this.layerID) == -1)
				return;

			var uid = this.getUID();
			var layer = this.createLayer(uid);

			if (this.layer === null && this.stack.children.length >= 1)
				this.layer = this.stack.children[0];

			this.stack.insertBefore(layer, this.layer);
			this.order.splice(this.layerID, 0, uid);
			this.count++;
			this.setActiveLayer(layer);
		}

		Stack.prototype.createLayer = function createLayer(uid) {
			var layer = document.createElement('div');
			var del = document.createElement('span');

			layer.className = 'node';
			layer.setAttribute('data-shid', uid);
			layer.setAttribute('data-type', 'layer');
			layer.textContent = 'shadow ' + uid;

			del.className = 'delete';
			del.setAttribute('data-type', 'delete');

			layer.appendChild(del);
			return layer;
		}

		Stack.prototype.getUID = function getUID() {
			return this.uid++;
		}

		// SOLVE IE BUG
		Stack.prototype.moveLayer = function moveLayer(direction) {
			if (this.count <= 1 || this.layer === null)
				return;
			if (direction === -1 && this.layerID === (this.count - 1) )
				return;
			if (direction === 1 && this.layerID === 0 )
				return;

			if (direction === -1) {
				var before = null;
				Tool.swapShadow(this.layerID, this.layerID + 1);
				this.swapOrder(this.layerID, this.layerID + 1);
				this.layerID += 1;

				if (this.layerID + 1 !== this.count)
					before = this.stack.children[this.layerID + 1];

				this.stack.insertBefore(this.layer, before);
				Tool.setActiveShadow(this.layerID, false);
			}

			if (direction === 1) {
				Tool.swapShadow(this.layerID, this.layerID - 1);
				this.swapOrder(this.layerID, this.layerID - 1);
				this.layerID -= 1;
				this.stack.insertBefore(this.layer, this.stack.children[this.layerID]);
				Tool.setActiveShadow(this.layerID, false);
			}
		}

		Stack.prototype.swapOrder = function swapOrder(pos1, pos2) {
			var x = this.order[pos1];
			this.order[pos1] = this.order[pos2];
			this.order[pos2] = x;
		}

		Stack.prototype.deleteLayer = function deleteLayer(node) {
			var shadowID =  node.getAttribute('data-shid') | 0;
			var index = this.order.indexOf(shadowID);
			this.stack.removeChild(this.stack.children[index]);
			this.order.splice(index, 1);
			this.count--;

			Tool.deleteShadow(index);

			if (index > this.layerID)
				return;

			if (index == this.layerID) {
				if (this.count >= 1) {
					this.layerID = 0;
					this.setActiveLayer(this.stack.children[0], true);
				}
				else {
					this.layer = null;
					this.show();
				}
			}

			if (index < this.layerID) {
				this.layerID--;
				Tool.setActiveShadow(this.layerID, true);
			}

		}

		Stack.prototype.setActiveLayer = function setActiveLayer(node) {
			elements.shadow_properties.style.display = 'block';
			elements.element_properties.style.display = 'none';

			if (this.layer)
				this.layer.removeAttribute('data-active');

			this.layer = node;
			this.layer.setAttribute('data-active', 'layer');

			var shadowID =  node.getAttribute('data-shid') | 0;
			this.layerID = this.order.indexOf(shadowID);
			Tool.setActiveShadow(this.layerID, true);
		}

		Stack.prototype.unsetActiveLayer = function unsetActiveLayer() {
			if (this.layer)
				this.layer.removeAttribute('data-active');

			this.layer = null;
			this.layerID = 0;
		}

		Stack.prototype.hide = function hide() {
			this.unsetActiveLayer();
			this.subject.removeAttribute('data-active');
			var style = this.container.style;
			style.left = '100%';
			style.zIndex = '0';
		}

		Stack.prototype.show = function show() {
			elements.shadow_properties.style.display = 'none';
			elements.element_properties.style.display = 'block';

			if (this.id === 'element') {
				elements.zIndex.style.display = 'none';
				elements.transform_rotate.style.display = 'none';
			}
			else {
				elements.zIndex.style.display = 'block';
				elements.transform_rotate.style.display = 'block';
			}

			this.subject.setAttribute('data-active', 'subject');
			var style = this.container.style;
			style.left = '0';
			style.zIndex = '10';
			Tool.setActiveClass(this.id);
		}

		function init() {

			var elem, size;
			var layerManager = getElemById("layer_manager");
			var layerMenu = getElemById("layer_menu");
			var container = getElemById("stack_container");

			elements.shadow_properties = getElemById('shadow_properties');
			elements.element_properties = getElemById('element_properties');
			elements.transform_rotate = getElemById('transform_rotate');
			elements.zIndex = getElemById('z-index');

			elem = document.querySelectorAll('#layer_menu [data-type="subject"]');
			size = elem.length;

			for (var i = 0; i < size; i++) {
				var S = new Stack(elem[i]);
				stacks[elem[i].id] = S;
				container.appendChild(S.container);
				Tool.addCssClass(elem[i].id);
			}

			active.stack = stacks['element'];
			stacks['element'].show();

			layerManager.addEventListener("click", mouseEvents);
			layerMenu.addEventListener("click", mouseEvents);

			ButtonManager.subscribe("before", function(value) {
				if (value === false && active.stack === stacks['before'])
					setActiveStack(stacks['element'])
				if (value === true && active.stack !== stacks['before'])
					setActiveStack(stacks['before'])
			});

			ButtonManager.subscribe("after", function(value) {
				if (value === false && active.stack === stacks['after'])
					setActiveStack(stacks['element'])
				if (value === true && active.stack !== stacks['after'])
					setActiveStack(stacks['after'])
			});
		}

		return {
			init : init
		}
	})();

	/*
	 * OutputManager
	 */
	var OutputManager = (function OutputManager() {
		var classes = [];
		var buttons = [];
		var active = null;
		var menu = null;
		var button_offset = 0;

		var crateOutputNode = function(topic, property) {

			var prop = document.createElement('div');
			var name = document.createElement('span');
			var value = document.createElement('span');

			var pmatch = property.match(/(^([a-z0-9\-]*)=\[([a-z0-9\-\"]*)\])|^([a-z0-9\-]*)/i);

			name.textContent = '\t' + pmatch[4];

			if (pmatch[3] !== undefined) {
				name.textContent = '\t' + pmatch[2];
				value.textContent = pmatch[3] + ';';
			}

			name.textContent += ': ';
			prop.className = 'css-property';
			name.className = 'name';
			value.className = 'value';
			prop.appendChild(name);
			prop.appendChild(value);

			classes[topic].node.appendChild(prop);
			classes[topic].line[property] = prop;
			classes[topic].prop[property] = value;
		}

		var OutputClass = function OutputClass(node) {
			var topic = node.getAttribute('data-topic');
			var prop = node.getAttribute('data-prop');
			var name = node.getAttribute('data-name');
			var properties = prop.split(' ');

			classes[topic] = {};
			classes[topic].node = node;
			classes[topic].prop = [];
			classes[topic].line = [];
			classes[topic].button = new Button(topic);

			var open_decl = document.createElement('div');
			var end_decl = document.createElement('div');

			open_decl.textContent = name + ' {';
			end_decl.textContent = '}';
			node.appendChild(open_decl);

			for (var i in properties)
				crateOutputNode(topic, properties[i]);

			node.appendChild(end_decl);
		}

		var Button = function Button(topic) {
			var button = document.createElement('div');

			button.className = 'button';
			button.textContent = topic;
			button.style.left = button_offset + 'px';
			button_offset += 100;

			button.addEventListener("click", function() {
				toggleDisplay(topic);
			})

			menu.appendChild(button);
			return button;
		}

		var toggleDisplay = function toggleDisplay(topic) {
			active.button.removeAttribute('data-active');
			active.node.style.display = 'none';
			active = classes[topic];
			active.node.style.display = 'block';
			active.button.setAttribute('data-active', 'true');
		}

		var toggleButton = function toggleButton(topic, value) {
			var display = (value === true) ? 'block' : 'none';
			classes[topic].button.style.display = display;

			if (value === true)
				toggleDisplay(topic);
			else
				toggleDisplay('element');
		}

		var updateProperty = function updateProperty(topic, property, data) {
			try {
				classes[topic].prop[property].textContent = data + ';';
			}
			catch(error) {
				// console.log("ERROR undefined : ", topic, property, data);
			}
		}

		var toggleProperty = function toggleProperty(topic, property, value) {
			var display = (value === true) ? 'block' : 'none';
			try {
				classes[topic].line[property].style.display = display;
			}
			catch(error) {
				// console.log("ERROR undefined : ",classes, topic, property, value);
			}
		}

		var init = function init() {

			menu = getElemById('menu');

			var elem = document.querySelectorAll('#output .output');
			var size = elem.length;
			for (var i = 0; i < size; i++)
				OutputClass(elem[i]);

			active = classes['element'];
			toggleDisplay('element');

			ButtonManager.subscribe("before", function(value) {
				toggleButton('before', value);
			});

			ButtonManager.subscribe("after", function(value) {
				toggleButton('after', value);
			});
		}

		return {
			init : init,
			updateProperty : updateProperty,
			toggleProperty : toggleProperty
		}

	})();

	/**
	 * Init Tool
	 */
	var init = function init() {
		ButtonManager.init();
		OutputManager.init();
		ColoPicker.init();
		SliderManager.init();
		LayerManager.init();
		PreviewMouseTracking.init("preview");
		Tool.init();
	}

	return {
		init : init
	}

})();
