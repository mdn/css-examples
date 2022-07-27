
/**
 * UI-SlidersManager
 */

var InputSliderManager = (function InputSliderManager() {

	var subscribers = {};
	var sliders = [];

	var InputComponent = function InputComponent(obj) {
		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.style.width = 50 + obj.precision * 10 + 'px';

		input.addEventListener('click', function(e) {
			this.select();
		});

		input.addEventListener('change', function(e) {
			var value = parseFloat(e.target.value);

			if (isNaN(value) === true)
				setValue(obj.topic, obj.value);
			else
				setValue(obj.topic, value);
		});

		return input;
	};

	var SliderComponent = function SliderComponent(obj, sign) {
		var slider = document.createElement('div');
		var startX = null;
		var start_value = 0;

		slider.addEventListener("click", function(e) {
			document.removeEventListener("mousemove", sliderMotion);
			setValue(obj.topic, obj.value + obj.step * sign);
		});

		slider.addEventListener("mousedown", function(e) {
			startX = e.clientX;
			start_value = obj.value;
			document.body.style.cursor = "e-resize";

			document.addEventListener("mouseup", slideEnd);
			document.addEventListener("mousemove", sliderMotion);
		});

		var slideEnd = function slideEnd(e) {
			document.removeEventListener("mousemove", sliderMotion);
			document.body.style.cursor = "auto";
			slider.style.cursor = "pointer";
		};

		var sliderMotion = function sliderMotion(e) {
			slider.style.cursor = "e-resize";
			var delta = (e.clientX - startX) / obj.sensitivity | 0;
			var value = delta * obj.step + start_value;
			setValue(obj.topic, value);
		};

		return slider;
	};

	var InputSlider = function(node) {
		var min		= parseFloat(node.getAttribute('data-min'));
		var max		= parseFloat(node.getAttribute('data-max'));
		var step	= parseFloat(node.getAttribute('data-step'));
		var value	= parseFloat(node.getAttribute('data-value'));
		var topic	= node.getAttribute('data-topic');
		var unit	= node.getAttribute('data-unit');
		var name 	= node.getAttribute('data-info');
		var sensitivity = node.getAttribute('data-sensitivity') | 0;
		var precision = node.getAttribute('data-precision') | 0;

		this.min = isNaN(min) ? 0 : min;
		this.max = isNaN(max) ? 100 : max;
		this.precision = precision >= 0 ? precision : 0;
		this.step = step < 0 || isNaN(step) ? 1 : step.toFixed(precision);
		this.topic = topic;
		this.node = node;
		this.unit = unit === null ? '' : unit;
		this.sensitivity = sensitivity > 0 ? sensitivity : 5;
		value = isNaN(value) ? this.min : value;

		var input = new InputComponent(this);
		var slider_left  = new SliderComponent(this, -1);
		var slider_right = new SliderComponent(this,  1);

		slider_left.className = 'ui-input-slider-left';
		slider_right.className = 'ui-input-slider-right';

		if (name) {
			var info = document.createElement('span');
			info.className = 'ui-input-slider-info';
			info.textContent = name;
			node.appendChild(info);
		}

		node.appendChild(slider_left);
		node.appendChild(input);
		node.appendChild(slider_right);

		this.input = input;
		sliders[topic] = this;
		setValue(topic, value);
	};

	InputSlider.prototype.setInputValue = function setInputValue() {
		this.input.value = this.value.toFixed(this.precision) + this.unit;
	};

	var setValue = function setValue(topic, value, send_notify) {
		var slider = sliders[topic];
		if (slider === undefined)
			return;

		value = parseFloat(value.toFixed(slider.precision));

		if (value > slider.max) value = slider.max;
		if (value < slider.min)	value = slider.min;

		slider.value = value;
		slider.node.setAttribute('data-value', value);

		slider.setInputValue();

		if (send_notify === false)
			return;

		notify.call(slider);
	};

	var setMax = function setMax(topic, value) {
		var slider = sliders[topic];
		if (slider === undefined)
			return;

		slider.max = value;
		setValue(topic, slider.value);
	};

	var setMin = function setMin(topic, value) {
		var slider = sliders[topic];
		if (slider === undefined)
			return;

		slider.min = value;
		setValue(topic, slider.value);
	};

	var setUnit = function setUnit(topic, unit) {
		var slider = sliders[topic];
		if (slider === undefined)
			return;

		slider.unit = unit;
		setValue(topic, slider.value);
	};

	var setStep = function setStep(topic, value) {
		var slider = sliders[topic];
		if (slider === undefined)
			return;

		slider.step = parseFloat(value);
		setValue(topic, slider.value);
	};

	var setPrecision = function setPrecision(topic, value) {
		var slider = sliders[topic];
		if (slider === undefined)
			return;

		value = value | 0;
		slider.precision = value;

		var step = parseFloat(slider.step.toFixed(value));
		if (step === 0)
			slider.step = 1 / Math.pow(10, value);

		setValue(topic, slider.value);
	};

	var setSensitivity = function setSensitivity(topic, value) {
		var slider = sliders[topic];
		if (slider === undefined)
			return;

		value = value | 0;

		slider.sensitivity = value > 0 ? value : 5;
	};

	var getNode =  function getNode(topic) {
		return sliders[topic].node;
	};

	var getPrecision =  function getPrecision(topic) {
		return sliders[topic].precision;
	};

	var getStep =  function getStep(topic) {
		return sliders[topic].step;
	};

	var subscribe = function subscribe(topic, callback) {
		if (subscribers[topic] === undefined)
			subscribers[topic] = [];
		subscribers[topic].push(callback);
	};

	var unsubscribe = function unsubscribe(topic, callback) {
		subscribers[topic].indexOf(callback);
		subscribers[topic].splice(index, 1);
	};

	var notify = function notify() {
		if (subscribers[this.topic] === undefined)
			return;
		for (var i = 0; i < subscribers[this.topic].length; i++)
			subscribers[this.topic][i](this.value);
	};

	var createSlider = function createSlider(topic, label) {
		var slider = document.createElement('div');
		slider.className = 'ui-input-slider';
		slider.setAttribute('data-topic', topic);

		if (label !== undefined)
			slider.setAttribute('data-info', label);

		new InputSlider(slider);
		return slider;
	};

	var init = function init() {
		var elem = document.querySelectorAll('.ui-input-slider');
		var size = elem.length;
		for (var i = 0; i < size; i++)
			new InputSlider(elem[i]);
	};

	return {
		init : init,
		setMax : setMax,
		setMin : setMin,
		setUnit : setUnit,
		setStep : setStep,
		getNode : getNode,
		getStep : getStep,
		setValue : setValue,
		subscribe : subscribe,
		unsubscribe : unsubscribe,
		setPrecision : setPrecision,
		setSensitivity : setSensitivity,
		getPrecision : getPrecision,
		createSlider : createSlider,
	};

})();

/**
 * UI-DropDown Select
 */

var DropDownManager = (function DropdownManager() {

	var subscribers = {};
	var dropdowns = [];
	var active = null;

	var visibility = ["hidden", "visible"];

	var DropDown = function DropDown(node) {
		var topic = node.getAttribute('data-topic');
		var label = node.getAttribute('data-label');
		var selected = node.getAttribute('data-selected') | 0;

		var select = document.createElement('div');
		var list = document.createElement('div');
		var uval = 0;
		var option = null;
		var option_value = null;

		list.className = 'ui-dropdown-list';
		select.className = 'ui-dropdown-select';

		while (node.firstElementChild !== null) {
			option = node.firstElementChild;
			option_value = option.getAttribute('data-value');

			if (option_value === null)
				option.setAttribute('data-value', uval);

			list.appendChild(node.firstElementChild);
			uval++;
		}

		node.appendChild(select);
		node.appendChild(list);

		select.onclick = this.toggle.bind(this);
		list.onclick = this.updateValue.bind(this);
		document.addEventListener('click', clickOut);

		this.state = 0;
		this.time = 0;
		this.dropmenu = list;
		this.select = select;
		this.toggle(false);
		this.value = {};
		this.topic = topic;

		if (label)
			select.textContent = label;
		else
			this.setNodeValue(list.children[selected]);

		dropdowns[topic] = this;

	};

	DropDown.prototype.toggle = function toggle(state) {
		if (typeof(state) === 'boolean')
			this.state = state === false ? 0 : 1;
		else
			this.state = 1 ^ this.state;

		if (active !== this) {
			if (active)
				active.toggle(false);
			active = this;
		}

		if (this.state === 0)
			this.dropmenu.setAttribute('data-hidden', 'true');
		else
			this.dropmenu.removeAttribute('data-hidden');

	};

	var clickOut = function clickOut(e) {
		if (active.state === 0 ||
			e.target === active.dropmenu ||
			e.target === active.select)
			return;

		active.toggle(false);
	};

	DropDown.prototype.updateValue = function updateValue(e) {

		if (Date.now() - this.time < 500)
			return;

		if (e.target.className !== "ui-dropdown-list") {
			this.setNodeValue(e.target);
			this.toggle(false);
		}

		this.time = Date.now();
	};

	DropDown.prototype.setNodeValue = function setNodeValue(node) {
		this.value['name'] = node.textContent;
		this.value['value'] = node.getAttribute('data-value');

		this.select.textContent = node.textContent;
		this.select.setAttribute('data-value', this.value['value']);

		notify.call(this);
	};

	var createDropDown = function createDropDown(topic, options) {

		var dropdown = document.createElement('div');
		dropdown.setAttribute('data-topic', topic);
		dropdown.className = 'ui-dropdown';

		for (var i in options) {
			var x = document.createElement('div');
			x.setAttribute('data-value', i);
			x.textContent = options[i];
			dropdown.appendChild(x);
		}

		new DropDown(dropdown);

		return dropdown;
	};

	var setValue = function setValue(topic, index) {
		if (dropdowns[topic] === undefined ||
			index >= dropdowns[topic].dropmenu.children.length)
			return;

		dropdowns[topic].setNodeValue(dropdowns[topic].dropmenu.children[index]);
	};

	var subscribe = function subscribe(topic, callback) {
		if (subscribers[topic] === undefined)
			subscribers[topic] = [];
		subscribers[topic].push(callback);
	};

	var unsubscribe = function unsubscribe(topic, callback) {
		var index = subscribers[topic].indexOf(callback);
		subscribers[topic].splice(index, 1);
	};

	var notify = function notify() {
		if (subscribers[this.topic] === undefined)
			return;

		for (var i in subscribers[this.topic]) {
			subscribers[this.topic][i](this.value);
		}
	};

	var init = function init() {
		var elem, size;

		elem = document.querySelectorAll('.ui-dropdown');
		size = elem.length;
		for (var i = 0; i < size; i++)
			new DropDown(elem[i]);

	};

	return {
		init : init,
		setValue : setValue,
		subscribe : subscribe,
		unsubscribe : unsubscribe,
		createDropDown : createDropDown
	};

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
	};

	var getNode =  function getNode(topic) {
		return buttons[topic].node;
	};

	var setValue = function setValue(topic, value) {
		var obj = buttons[topic];
		if (obj === undefined)
			return;

		obj.checkbox.checked = value;
		notify.call(obj);
	};

	var subscribe = function subscribe(topic, callback) {
		if (subscribers[topic] === undefined)
			subscribers[topic] = [];

		subscribers[topic].push(callback);
	};

	var unsubscribe = function unsubscribe(topic, callback) {
		subscribers[topic].indexOf(callback);
		subscribers[topic].splice(index, 1);
	};

	var notify = function notify() {
		if (subscribers[this.topic] === undefined)
			return;
		for (var i = 0; i < subscribers[this.topic].length; i++)
			subscribers[this.topic][i](this.checkbox.checked);
	};

	var init = function init() {
		var elem = document.querySelectorAll('.ui-checkbox');
		var size = elem.length;
		for (var i = 0; i < size; i++)
			new CheckBox(elem[i]);
	};

	return {
		init : init,
		setValue : setValue,
		subscribe : subscribe,
		unsubscribe : unsubscribe
	};

})();

window.addEventListener("load", function() {
	BorderImage.init();
});

var BorderImage = (function BorderImage() {

	var getElemById = document.getElementById.bind(document);

	var subject;
	var preview;
	var guidelines = [];
	var positions = ['top', 'right', 'bottom', 'left'];

	var makeDraggable = function makeDraggable(elem) {

		var offsetTop;
		var offsetLeft;

		elem.setAttribute('data-draggable', 'true');

		var dragStart = function dragStart(e) {
			if (e.target.getAttribute('data-draggable') !== 'true' ||
				e.target !== elem || e.button !== 0)
				return;

			offsetLeft = e.clientX - elem.offsetLeft;
			offsetTop = e.clientY - elem.offsetTop;

			document.addEventListener('mousemove', mouseDrag);
			document.addEventListener('mouseup', dragEnd);
		};

		var dragEnd = function dragEnd(e) {
			if (e.button !== 0)
				return;

			document.removeEventListener('mousemove', mouseDrag);
			document.removeEventListener('mouseup', dragEnd);
		};

		var mouseDrag = function mouseDrag(e) {

			elem.style.left = e.clientX - offsetLeft + 'px';
			elem.style.top = e.clientY - offsetTop + 'px';
		};

		elem.addEventListener('mousedown', dragStart, false);
	};

	var PreviewControl = function PreviewControl() {

		var dragging = false;
		var valueX = null;
		var valueY = null;

		var dragStart = function dragStart(e) {
			if (e.button !== 0)
				return;

			valueX = e.clientX - preview.clientWidth;
			valueY = e.clientY - preview.clientHeight;
			dragging = true;

			document.addEventListener('mousemove', mouseDrag);
		};

		var dragEnd = function dragEnd(e) {
			if (e.button !== 0 || dragging === false)
				return;

			document.removeEventListener('mousemove', mouseDrag);
			dragging = false;
		};

		var mouseDrag = function mouseDrag(e) {
			InputSliderManager.setValue('preview-width', e.clientX - valueX);
			InputSliderManager.setValue('preview-height', e.clientY - valueY);
		};

		var init = function init() {

			makeDraggable(preview);
			makeDraggable(subject);

			var handle = document.createElement('div');
			handle.className = 'resize-handle';

			handle.addEventListener('mousedown', dragStart);
			document.addEventListener('mouseup', dragEnd);

			preview.appendChild(handle);

		};

		return {
			init: init
		};

	}();

	var ImageReader = (function ImageReader() {

		var fReader = new FileReader();
		var browse = document.createElement('input');

		var loadImage = function loadImage(e) {
			if (browse.files.length === 0)
				return;

			var file = browse.files[0];

			if (file.type.slice(0, 5) !== 'image')
				return;

			fReader.readAsDataURL(file);

			return false;
		};

		fReader.onload = function(e) {
			ImageControl.loadRemoteImage(e.target.result);
		};

		var load = function load() {
			browse.click();
		};

		browse.setAttribute('type', 'file');
		browse.style.display = 'none';
		browse.onchange = loadImage;

		return {
			load: load
		};

	})();

	var ImageControl = (function ImageControl() {

		var scale = 0.5;
		var imgSource = new Image();
		var imgState = null;
		var selected = null;

		var topics = ['slice', 'width', 'outset'];
		var properties = {};
		properties['border1'] = {
			fill			: false,

			slice_values	: [27, 27, 27, 27],
			width_values	: [20, 20, 20, 20],
			outset_values	: [0, 0, 0, 0],

			slice_units		: [0, 0, 0, 0],
			width_units		: [0, 0, 0, 0],
			outset_units	: [0, 0, 0, 0],

			repeat			: [1, 1],
			size			: [300, 200],
			preview_area	: 400
		};

		properties['border2'] = {
			fill			: false,

			slice_values	: [33, 33, 33, 33],
			width_values	: [1.5, 1.5, 1.5, 1.5],
			outset_values	: [0, 0, 0, 0],

			slice_units		: [1, 1, 1, 1],
			width_units		: [2, 2, 2, 2],
			outset_units	: [0, 0, 0, 0],

			repeat			: [2, 2],
			size			: [300, 200],
			preview_area	: 400
		};

		properties['border3'] = {
			fill			: true,

			slice_values	: [15, 15, 15, 15],
			width_values	: [10, 10, 10, 10],
			outset_values	: [0, 0, 0, 0],

			slice_units		: [0, 0, 0, 0],
			width_units		: [0, 0, 0, 0],
			outset_units	: [0, 0, 0, 0],

			repeat			: [2, 2],
			size			: [300, 200],
			preview_area	: 400
		};

		properties['border4'] = {
			fill			: false,

			slice_values	: [13, 13, 13, 13],
			width_values	: [13, 13, 13, 13],
			outset_values	: [13, 13, 13, 13],

			slice_units		: [0, 0, 0, 0],
			width_units		: [0, 0, 0, 0],
			outset_units	: [0, 0, 0, 0],

			repeat			: [0, 0],
			size			: [300, 200],
			preview_area	: 400
		};

		properties['border5'] = {
			fill			: false,

			slice_values	: [12, 12, 12, 12],
			width_values	: [12, 12, 12, 12],
			outset_values	: [0, 0, 0, 0],

			slice_units		: [0, 0, 0, 0],
			width_units		: [0, 0, 0, 0],
			outset_units	: [0, 0, 0, 0],

			repeat			: [0, 0],
			size			: [300, 200],
			preview_area	: 400,
		};

		properties['border6'] = {
			fill			: false,

			slice_values	: [42, 42, 42, 42],
			width_values	: [42, 42, 42, 42],
			outset_values	: [0, 0, 0, 0],

			slice_units		: [0, 0, 0, 0],
			width_units		: [0, 0, 0, 0],
			outset_units	: [0, 0, 0, 0],

			repeat			: [2, 2],
			size			: [350, 350],
			preview_area	: 500,
		};

		var loadLocalImage = function loadLocalImage(source) {
			var location = "images/" + source;
			imgSource.src = location;
		};

		var loadRemoteImage = function loadRemoteImage(source) {
			imgSource.src = source;
			if (selected)
				selected.removeAttribute('selected');
			Tool.setOutputCSS('source', 'url("' + source + '")');
		};

		var pickImage = function pickImage(e) {
			if (e.target.className === 'image') {
				selected = e.target;
				selected.setAttribute('selected', 'true');
				loadRemoteImage(e.target.src);
				imgState = e.target.getAttribute('data-stateID');
			}
		};

		var loadImageState = function loadImageState(stateID) {
			if (properties[stateID] === undefined)
				return;

			var prop = properties[stateID];
			var topic;
			var unit_array;
			var value_array;

			for (var i in topics) {
				for (var j=0; j<4; j++) {
					topic = topics[i] + '-' + positions[j];
					unit_array = topics[i] + '_units';
					value_array = topics[i] + '_values';
					InputSliderManager.setValue(topic, prop[value_array][j]);
					DropDownManager.setValue(topic, prop[unit_array][j]);
				}
			}

			ButtonManager.setValue('slice-fill', prop['fill']);
			DropDownManager.setValue('image-repeat-X', prop['repeat'][0]);
			DropDownManager.setValue('image-repeat-Y', prop['repeat'][1]);
			InputSliderManager.setValue('preview-width', prop['size'][0]);
			InputSliderManager.setValue('preview-height', prop['size'][1]);
			InputSliderManager.setValue('preview-area-height', prop['preview_area']);
		};

		var update = function update() {
			scale =  Math.min(300, (30000 / this.width) | 0);
			setScale(scale);
			InputSliderManager.setValue('scale', scale, false);

			subject.style.backgroundImage = 'url("' + this.src + '")';
			preview.style.borderImageSource = 'url("' + this.src + '")';

			guidelines['slice-top'].setMax(this.height);
			guidelines['slice-right'].setMax(this.width);
			guidelines['slice-bottom'].setMax(this.height);
			guidelines['slice-left'].setMax(this.width);

			if (imgState)
				loadImageState(imgState);
		};

		var setScale = function setScale(value) {
			scale = value;
			var w = imgSource.width * scale / 100 | 0;
			var h = imgSource.height * scale / 100 | 0;
			subject.style.width = w + 'px';
			subject.style.height = h + 'px';

			for (var i = 0; i < positions.length; i++)
				guidelines['slice-' + positions[i]].updateGuidelinePos();
		};

		var getScale = function getScale() {
			return scale/100;
		};

		var toggleGallery = function toggleGallery() {
			var gallery = getElemById('image-gallery');
			var button  = getElemById('toggle-gallery');
			var state = 1;
			button.addEventListener('click', function() {
				state = 1 ^ state;
				if (state === 0) {
					gallery.setAttribute('data-collapsed', 'true');
					button.setAttribute('data-action', 'show');
				}
				else {
					gallery.removeAttribute('data-collapsed');
					button.setAttribute('data-action', 'hide');
				}
			});
		};

		var init = function init() {
			var gallery = getElemById('image-gallery');
			var browse = getElemById('load-image');
			var remote = getElemById('remote-url');
			var load_remote = getElemById('load-remote');

			remote.addEventListener('change', function(){
				loadRemoteImage(this.value);
			});

			load_remote.addEventListener('click', function(){
				loadRemoteImage(remote.value);
			});

			browse.addEventListener('click', ImageReader.load);
			gallery.addEventListener('click', pickImage);
			imgSource.addEventListener('load', update);

			InputSliderManager.subscribe('scale', setScale);
			InputSliderManager.setValue('scale', scale);
			imgState = 'border1';
			loadRemoteImage('border-image-1.png');
			toggleGallery();
		};

		return {
			init: init,
			getScale : getScale,
			loadRemoteImage: loadRemoteImage
		};

	})();

	var GuideLine = function GuideLine(node) {
		var topic = node.getAttribute('data-topic');
		var axis = node.getAttribute('data-axis');

		this.node = node;
		this.topic = topic;
		this.axis = axis;
		this.info = topic.split('-')[1];

		this.position = 0;
		this.value = 0;
		this.unit = 0;
		this.max = 0;
		this.pos = positions.indexOf(this.info);

		guidelines[topic] = this;

		var relative_container = document.createElement('div');
		var tooltip = document.createElement('div');
		var tooltip2 = document.createElement('div');

		tooltip.className = 'tooltip';
		tooltip.setAttribute('data-info', this.info);

		tooltip2.className = 'tooltip2';
		tooltip2.textContent = this.info;
		tooltip2.setAttribute('data-info', this.info);

		this.tooltip = tooltip;

		relative_container.appendChild(tooltip);
		relative_container.appendChild(tooltip2);
		node.appendChild(relative_container);

		var startX = 0;
		var startY = 0;
		var start = 0;

		var startDrag = function startDrag(e) {
			startX = e.clientX;
			startY = e.clientY;
			start = guidelines[topic].position;
			document.body.setAttribute('data-move', axis);
			relative_container.setAttribute('data-active', '');
			node.setAttribute('data-active', '');

			document.addEventListener('mousemove', updateGuideline);
			document.addEventListener('mouseup', endDrag);
		};

		var endDrag = function endDrag() {
			document.body.removeAttribute('data-move');
			relative_container.removeAttribute('data-active');
			node.removeAttribute('data-active');

			document.removeEventListener('mousemove', updateGuideline);
		};

		var updateGuideline = function updateGuideline(e) {
			var value;
			if (topic === 'slice-top')
				value = e.clientY - startY + start;

			if (topic === 'slice-right')
				value = startX - e.clientX + start;

			if (topic === 'slice-bottom')
				value = startY - e.clientY + start;

			if (topic === 'slice-left')
				value = e.clientX - startX + start;

			if (this.unit === 0)
				InputSliderManager.setValue(topic, value * 1 / ImageControl.getScale() | 0);
			else {
				InputSliderManager.setValue(topic, (value * 100 / (this.max * ImageControl.getScale())) | 0);
			}

		}.bind(this);

		node.addEventListener("mousedown", startDrag);

		InputSliderManager.subscribe(topic, this.setPosition.bind(this));
		InputSliderManager.setValue(topic, this.position);
	};

	GuideLine.prototype.updateGuidelinePos = function updateGuidelinePos() {
		if (this.unit === 0)
			this.position = this.value * ImageControl.getScale() | 0;
		else
			this.position = this.value * this.max * ImageControl.getScale() / 100 | 0;

		this.node.style[this.info] = this.position + 'px';
	};

	GuideLine.prototype.setPosition = function setPosition(value) {
		this.value = value;
		this.tooltip.textContent = value;
		this.updateGuidelinePos();
		Tool.setBorderSlice(this.pos, value);
	};

	GuideLine.prototype.setMax = function setMax(max) {
		this.max = max;
		this.updateLimit();
	};

	GuideLine.prototype.updateLimit = function updateLimit() {
		if (this.unit === 1)
			InputSliderManager.setMax(this.topic, 100);
		else
			InputSliderManager.setMax(this.topic, this.max);
	};

	GuideLine.prototype.setUnit = function setUnit(type) {
		if (type === '%')	this.unit = 1;
		if (type === '')	this.unit = 0;
		this.updateLimit();
	};

	/*
	 * Unit panel
	 */
	var UnitPanel = (function UnitPanel () {

		var panel;
		var title;
		var precision;
		var step;
		var unit_topic = null; // settings are made for this topic
		var step_option = [1, 0.1, 0.01];

		var updatePrecision = function updatePrecision(value) {
			InputSliderManager.setPrecision('unit-step', value);
			InputSliderManager.setStep('unit-step', step_option[value]);
			InputSliderManager.setMin('unit-step', step_option[value]);

			if (unit_topic)
				InputSliderManager.setPrecision(unit_topic, value);
		};

		var updateUnitSettings = function updateUnitSettings(value) {
			if (unit_topic)
				InputSliderManager.setStep(unit_topic, value);
		};

		var show = function show(e) {
			var topic = e.target.getAttribute('data-topic');
			var precision = InputSliderManager.getPrecision(topic);
			var step = InputSliderManager.getStep(topic);

			unit_topic = topic;
			title.textContent = topic;

			panel.setAttribute('data-active', 'true');
			panel.style.top = e.target.offsetTop - 40 + 'px';
			panel.style.left = e.target.offsetLeft + 30 + 'px';

			InputSliderManager.setValue('unit-precision', precision);
			InputSliderManager.setValue('unit-step', step);
		};

		var init = function init() {
			panel = document.createElement('div');
			title = document.createElement('div');
			var close = document.createElement('div');

			step = InputSliderManager.createSlider('unit-step', 'step');
			precision = InputSliderManager.createSlider('unit-precision', 'precision');

			InputSliderManager.setStep('unit-precision', 1);
			InputSliderManager.setMax('unit-precision', 2);
			InputSliderManager.setValue('unit-precision', 2);
			InputSliderManager.setSensitivity('unit-precision', 20);

			InputSliderManager.setValue('unit-step', 1);
			InputSliderManager.setStep('unit-step', 0.01);
			InputSliderManager.setPrecision('unit-step', 2);

			InputSliderManager.subscribe('unit-precision', updatePrecision);
			InputSliderManager.subscribe('unit-step', updateUnitSettings);

			close.addEventListener('click', function () {
				panel.setAttribute('data-active', 'false');
			});

			title.textContent = 'Properties';
			title.className = 'title';
			close.className = 'close';
			panel.id = 'unit-settings';
			panel.setAttribute('data-active', 'false');
			panel.appendChild(title);
			panel.appendChild(precision);
			panel.appendChild(step);
			panel.appendChild(close);
			document.body.appendChild(panel);
		};

		return {
			init : init,
			show : show
		};

	})();

	/**
	 * Tool Manager
	 */
	var Tool = (function Tool() {
		var preview_area;
		var dropdown_unit_options = [
			{ '' : '--', '%' : '%'},
			{ 'px' : 'px', '%' : '%', 'em' : 'em'},
			{ 'px' : 'px', 'em' : 'em'},
		];

		var border_slice = [];
		var border_width = [];
		var border_outset = [];

		var border_slice_values = [];
		var border_width_values = [];
		var border_outset_values = [];

		var border_slice_units = ['', '', '', ''];
		var border_width_units = ['px', 'px', 'px', 'px'];
		var border_outset_units = ['px', 'px', 'px', 'px'];

		var border_fill = false;
		var border_repeat = ['round', 'round'];
		var CSS_code = {
			'source' : null,
			'slice' : null,
			'width' : null,
			'outset' : null,
			'repeat' : null
		};

		var setBorderSlice = function setBorderSlice(positionID, value) {
			border_slice[positionID] = value + border_slice_units[positionID];
			updateBorderSlice();
		};

		var updateBorderSlice = function updateBorderSlice() {
			var value = border_slice.join(' ');
			if (border_fill === true)
				value += ' fill';

			preview.style.borderImageSlice = value;
			setOutputCSS('slice', value);
		};

		var setBorderFill = function setBorderFill(value) {
			border_fill = value;
			var bimgslice = border_slice.join(' ');;
			if (value === true)
				bimgslice += ' fill';

			preview.style.borderImageSlice = bimgslice;
		};

		var updateBorderWidth = function updateBorderWidth() {
			var value = border_width.join(' ');
			preview.style.borderImageWidth = value;
			setOutputCSS('width', value);
		};

		var updateBorderOutset = function updateBorderOutset() {
			var value = border_outset.join(' ');
			preview.style.borderImageOutset = border_outset.join(' ');
			setOutputCSS('outset', value);
		};

		var setBorderRepeat = function setBorderRepeat(obj) {
			border_repeat[obj.value] = obj.name;
			var value = border_repeat.join(' ');
			preview.style.borderImageRepeat = value;
			setOutputCSS('repeat', value);
		};

		var setOutputCSS = function setOutputCSS(topic, value) {
			CSS_code[topic].textContent = value + ';';
		};

		var setPreviewFontSize = function setPreviewFontSize(value) {
			preview.style.fontSize = value + 'px';
		};

		var setPreviewWidth = function setPreviewWidth(value) {
			preview.style.width = value + 'px';
		};

		var setPreviewHeight = function setPreviewHeight(value) {
			preview.style.height = value + 'px';
		};

		var setPreviewAreaHeight = function setPreviewAreaHeight(value) {
			preview_area.style.height = value + 'px';
		};

		var updateDragOption = function updateDragOption(value) {
			if (value === true)
				subject.setAttribute('data-draggable', 'true');
			else
				subject.removeAttribute('data-draggable');
		};

		var createProperty = function createProperty(topic, labelID, optionsID) {

			var slider = InputSliderManager.createSlider(topic, positions[labelID]);
			var dropdown = DropDownManager.createDropDown(topic, dropdown_unit_options[optionsID]);

			InputSliderManager.setSensitivity(topic, 3);
			InputSliderManager.setPrecision(topic, 1);

			var property = document.createElement('div');
			var config = document.createElement('div');

			property.className = 'property';
			config.className = 'config';
			config.setAttribute('data-topic', topic);
			config.addEventListener('click', UnitPanel.show);

			property.appendChild(slider);
			property.appendChild(dropdown);
			property.appendChild(config);

			return property;
		};

		var initBorderSliceControls = function initBorderSliceControls() {
			var container = getElemById('border-slice-control');

			var listenForChanges = function listenForChanges(topic, id) {
				InputSliderManager.subscribe(topic, function(value) {
					border_slice_values[id] = value;
					border_slice[id] = value + border_slice_units[id];
					updateBorderSlice();
				});

				DropDownManager.subscribe(topic, function(obj) {
					guidelines[topic].setUnit(obj.value);
					border_slice_units[id] = obj.value;
					border_slice[id] = border_slice_values[id] + obj.value;
					updateBorderSlice();
				});
			};

			for (var i = 0; i < positions.length; i++) {
				var topic = 'slice-' + positions[i];
				var property = createProperty(topic, i, 0);
				listenForChanges(topic, i);

				container.appendChild(property);
			}

			container.appendChild(container.children[1]);

		};

		var initBorderWidthControls = function initBorderWidthControls() {
			var container = getElemById('border-width-control');

			var listenForChanges = function listenForChanges(topic, id) {
				InputSliderManager.subscribe(topic, function(value) {
					border_width_values[id] = value;
					border_width[id] = value + border_width_units[id];
					updateBorderWidth();
				});

				DropDownManager.subscribe(topic, function(obj) {
					if (obj.value === '%')
						InputSliderManager.setMax(topic, 100);
					else
						InputSliderManager.setMax(topic, 1000);

					border_width_units[id] = obj.value;
					border_width[id] = border_width_values[id] + obj.value;
					updateBorderWidth();
				});
			};

			for (var i = 0; i < positions.length; i++) {
				var topic = 'width-' + positions[i];
				var property = createProperty(topic, i, 1);
				InputSliderManager.setMax(topic, 1000);
				listenForChanges(topic, i);

				container.appendChild(property);
			}
		};

		var initBorderOutsetControls = function initBorderOutsetControls() {

			var container = getElemById('border-outset-control');

			var listenForChanges = function listenForChanges(topic, id) {
				InputSliderManager.subscribe(topic, function(value) {
					border_outset_values[id] = value;
					border_outset[id] = value + border_outset_units[id];
					updateBorderOutset();
				});

				DropDownManager.subscribe(topic, function(obj) {
					border_outset_units[id] = obj.value;
					border_outset[id] = border_outset_values[id] + obj.value;
					updateBorderOutset();
				});
			};

			for (var i = 0; i < positions.length; i++) {
				var topic = 'outset-' + positions[i];
				var property = createProperty(topic, i, 2);
				InputSliderManager.setMax(topic, 1000);
				listenForChanges(topic, i);

				container.appendChild(property);
			}
		};

		var init = function init() {

			var gallery =
			subject = getElemById('subject');
			preview = getElemById("preview");
			preview_area = getElemById("preview_section");

			CSS_code['source'] = getElemById("out-border-source");
			CSS_code['slice'] = getElemById("out-border-slice");
			CSS_code['width'] = getElemById("out-border-width");
			CSS_code['outset'] = getElemById("out-border-outset");
			CSS_code['repeat'] = getElemById("out-border-repeat");

			initBorderSliceControls();
			initBorderWidthControls();
			initBorderOutsetControls();

			var elem = document.querySelectorAll('.guideline');
			var size = elem.length;
			for (var i = 0; i < size; i++)
				new GuideLine(elem[i]);

			PreviewControl.init();

			ButtonManager.subscribe('slice-fill',setBorderFill);
			ButtonManager.subscribe('drag-subject', updateDragOption);
			ButtonManager.setValue('drag-subject', false);

			DropDownManager.subscribe('image-repeat-X', setBorderRepeat);
			DropDownManager.subscribe('image-repeat-Y', setBorderRepeat);

			InputSliderManager.subscribe('preview-area-height', setPreviewAreaHeight);
			InputSliderManager.subscribe('preview-width', setPreviewWidth);
			InputSliderManager.subscribe('preview-height', setPreviewHeight);
			InputSliderManager.subscribe('font-size', setPreviewFontSize);
			InputSliderManager.setValue('preview-width', 300);
			InputSliderManager.setValue('preview-height', 200);
		};

		return {
			init: init,
			setOutputCSS: setOutputCSS,
			setBorderSlice: setBorderSlice
		};

	})();

	/**
	 * Init Tool
	 */
	var init = function init() {
		InputSliderManager.init();
		DropDownManager.init();
		ButtonManager.init();
		UnitPanel.init();
		Tool.init();
		ImageControl.init();
	};

	return {
		init : init
	};

})();
