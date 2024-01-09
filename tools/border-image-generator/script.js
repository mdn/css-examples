/**
 * UI-SlidersManager
 */

let InputSliderManager = (function InputSliderManager() {
  let subscribers = {};
  let sliders = [];

  let InputComponent = function InputComponent(obj) {
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.style.width = 50 + obj.precision * 10 + "px";

    input.addEventListener("click", function (e) {
      this.select();
    });

    input.addEventListener("change", function (e) {
      let value = parseFloat(e.target.value);

      if (isNaN(value) === true) setValue(obj.topic, obj.value);
      else setValue(obj.topic, value);
    });

    return input;
  };

  let SliderComponent = function SliderComponent(obj, sign) {
    let slider = document.createElement("div");
    let startX = null;
    let start_value = 0;

    slider.addEventListener("click", function (e) {
      document.removeEventListener("mousemove", sliderMotion);
      setValue(obj.topic, obj.value + obj.step * sign);
    });

    slider.addEventListener("mousedown", function (e) {
      startX = e.clientX;
      start_value = obj.value;
      document.body.style.cursor = "e-resize";

      document.addEventListener("mouseup", slideEnd);
      document.addEventListener("mousemove", sliderMotion);
    });

    let slideEnd = function slideEnd(e) {
      document.removeEventListener("mousemove", sliderMotion);
      document.body.style.cursor = "auto";
      slider.style.cursor = "pointer";
    };

    let sliderMotion = function sliderMotion(e) {
      slider.style.cursor = "e-resize";
      let delta = ((e.clientX - startX) / obj.sensitivity) | 0;
      let value = delta * obj.step + start_value;
      setValue(obj.topic, value);
    };

    return slider;
  };

  let InputSlider = function (node) {
    let min = parseFloat(node.getAttribute("data-min"));
    let max = parseFloat(node.getAttribute("data-max"));
    let step = parseFloat(node.getAttribute("data-step"));
    let value = parseFloat(node.getAttribute("data-value"));
    let topic = node.getAttribute("data-topic");
    let unit = node.getAttribute("data-unit");
    let name = node.getAttribute("data-info");
    let sensitivity = node.getAttribute("data-sensitivity") | 0;
    let precision = node.getAttribute("data-precision") | 0;

    this.min = isNaN(min) ? 0 : min;
    this.max = isNaN(max) ? 100 : max;
    this.precision = precision >= 0 ? precision : 0;
    this.step = step < 0 || isNaN(step) ? 1 : step.toFixed(precision);
    this.topic = topic;
    this.node = node;
    this.unit = unit === null ? "" : unit;
    this.sensitivity = sensitivity > 0 ? sensitivity : 5;
    value = isNaN(value) ? this.min : value;

    let input = new InputComponent(this);
    let slider_left = new SliderComponent(this, -1);
    let slider_right = new SliderComponent(this, 1);

    slider_left.className = "ui-input-slider-left";
    slider_right.className = "ui-input-slider-right";

    if (name) {
      let info = document.createElement("span");
      info.className = "ui-input-slider-info";
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

  let setValue = function setValue(topic, value, send_notify) {
    let slider = sliders[topic];
    if (slider === undefined) return;

    value = parseFloat(value.toFixed(slider.precision));

    if (value > slider.max) value = slider.max;
    if (value < slider.min) value = slider.min;

    slider.value = value;
    slider.node.setAttribute("data-value", value);

    slider.setInputValue();

    if (send_notify === false) return;

    notify.call(slider);
  };

  let setMax = function setMax(topic, value) {
    let slider = sliders[topic];
    if (slider === undefined) return;

    slider.max = value;
    setValue(topic, slider.value);
  };

  let setMin = function setMin(topic, value) {
    let slider = sliders[topic];
    if (slider === undefined) return;

    slider.min = value;
    setValue(topic, slider.value);
  };

  let setUnit = function setUnit(topic, unit) {
    let slider = sliders[topic];
    if (slider === undefined) return;

    slider.unit = unit;
    setValue(topic, slider.value);
  };

  let setStep = function setStep(topic, value) {
    let slider = sliders[topic];
    if (slider === undefined) return;

    slider.step = parseFloat(value);
    setValue(topic, slider.value);
  };

  let setPrecision = function setPrecision(topic, value) {
    let slider = sliders[topic];
    if (slider === undefined) return;

    value = value | 0;
    slider.precision = value;

    let step = parseFloat(slider.step.toFixed(value));
    if (step === 0) slider.step = 1 / Math.pow(10, value);

    setValue(topic, slider.value);
  };

  let setSensitivity = function setSensitivity(topic, value) {
    let slider = sliders[topic];
    if (slider === undefined) return;

    value = value | 0;

    slider.sensitivity = value > 0 ? value : 5;
  };

  let getNode = function getNode(topic) {
    return sliders[topic].node;
  };

  let getPrecision = function getPrecision(topic) {
    return sliders[topic].precision;
  };

  let getStep = function getStep(topic) {
    return sliders[topic].step;
  };

  let subscribe = function subscribe(topic, callback) {
    if (subscribers[topic] === undefined) subscribers[topic] = [];
    subscribers[topic].push(callback);
  };

  let unsubscribe = function unsubscribe(topic, callback) {
    subscribers[topic].indexOf(callback);
    subscribers[topic].splice(index, 1);
  };

  let notify = function notify() {
    if (subscribers[this.topic] === undefined) return;
    for (let i = 0; i < subscribers[this.topic].length; i++)
      subscribers[this.topic][i](this.value);
  };

  let createSlider = function createSlider(topic, label) {
    let slider = document.createElement("div");
    slider.className = "ui-input-slider";
    slider.setAttribute("data-topic", topic);

    if (label !== undefined) slider.setAttribute("data-info", label);

    new InputSlider(slider);
    return slider;
  };

  let init = function init() {
    let elem = document.querySelectorAll(".ui-input-slider");
    let size = elem.length;
    for (let i = 0; i < size; i++) new InputSlider(elem[i]);
  };

  return {
    init: init,
    setMax: setMax,
    setMin: setMin,
    setUnit: setUnit,
    setStep: setStep,
    getNode: getNode,
    getStep: getStep,
    setValue: setValue,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    setPrecision: setPrecision,
    setSensitivity: setSensitivity,
    getPrecision: getPrecision,
    createSlider: createSlider,
  };
})();

/**
 * UI-DropDown Select
 */

let DropDownManager = (function DropdownManager() {
  let subscribers = {};
  let dropdowns = [];
  let active = null;

  let visibility = ["hidden", "visible"];

  let DropDown = function DropDown(node) {
    let topic = node.getAttribute("data-topic");
    let label = node.getAttribute("data-label");
    let selected = node.getAttribute("data-selected") | 0;

    let select = document.createElement("div");
    let list = document.createElement("div");
    let uval = 0;
    let option = null;
    let option_value = null;

    list.className = "ui-dropdown-list";
    select.className = "ui-dropdown-select";

    while (node.firstElementChild !== null) {
      option = node.firstElementChild;
      option_value = option.getAttribute("data-value");

      if (option_value === null) option.setAttribute("data-value", uval);

      list.appendChild(node.firstElementChild);
      uval++;
    }

    node.appendChild(select);
    node.appendChild(list);

    select.onclick = this.toggle.bind(this);
    list.onclick = this.updateValue.bind(this);
    document.addEventListener("click", clickOut);

    this.state = 0;
    this.time = 0;
    this.dropmenu = list;
    this.select = select;
    this.toggle(false);
    this.value = {};
    this.topic = topic;

    if (label) select.textContent = label;
    else this.setNodeValue(list.children[selected]);

    dropdowns[topic] = this;
  };

  DropDown.prototype.toggle = function toggle(state) {
    if (typeof state === "boolean") this.state = state === false ? 0 : 1;
    else this.state = 1 ^ this.state;

    if (active !== this) {
      if (active) active.toggle(false);
      active = this;
    }

    if (this.state === 0) this.dropmenu.setAttribute("data-hidden", "true");
    else this.dropmenu.removeAttribute("data-hidden");
  };

  let clickOut = function clickOut(e) {
    if (
      active.state === 0 ||
      e.target === active.dropmenu ||
      e.target === active.select
    )
      return;

    active.toggle(false);
  };

  DropDown.prototype.updateValue = function updateValue(e) {
    if (Date.now() - this.time < 500) return;

    if (e.target.className !== "ui-dropdown-list") {
      this.setNodeValue(e.target);
      this.toggle(false);
    }

    this.time = Date.now();
  };

  DropDown.prototype.setNodeValue = function setNodeValue(node) {
    this.value["name"] = node.textContent;
    this.value["value"] = node.getAttribute("data-value");

    this.select.textContent = node.textContent;
    this.select.setAttribute("data-value", this.value["value"]);

    notify.call(this);
  };

  let createDropDown = function createDropDown(topic, options) {
    let dropdown = document.createElement("div");
    dropdown.setAttribute("data-topic", topic);
    dropdown.className = "ui-dropdown";

    for (let i in options) {
      let x = document.createElement("div");
      x.setAttribute("data-value", i);
      x.textContent = options[i];
      dropdown.appendChild(x);
    }

    new DropDown(dropdown);

    return dropdown;
  };

  let setValue = function setValue(topic, index) {
    if (
      dropdowns[topic] === undefined ||
      index >= dropdowns[topic].dropmenu.children.length
    )
      return;

    dropdowns[topic].setNodeValue(dropdowns[topic].dropmenu.children[index]);
  };

  let subscribe = function subscribe(topic, callback) {
    if (subscribers[topic] === undefined) subscribers[topic] = [];
    subscribers[topic].push(callback);
  };

  let unsubscribe = function unsubscribe(topic, callback) {
    let index = subscribers[topic].indexOf(callback);
    subscribers[topic].splice(index, 1);
  };

  let notify = function notify() {
    if (subscribers[this.topic] === undefined) return;

    for (let i in subscribers[this.topic]) {
      subscribers[this.topic][i](this.value);
    }
  };

  let init = function init() {
    let elem, size;

    elem = document.querySelectorAll(".ui-dropdown");
    size = elem.length;
    for (let i = 0; i < size; i++) new DropDown(elem[i]);
  };

  return {
    init: init,
    setValue: setValue,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    createDropDown: createDropDown,
  };
})();

/**
 * UI-ButtonManager
 */

let ButtonManager = (function CheckBoxManager() {
  let subscribers = [];
  let buttons = [];

  let CheckBox = function CheckBox(node) {
    let topic = node.getAttribute("data-topic");
    let state = node.getAttribute("data-state");
    let name = node.getAttribute("data-label");
    let align = node.getAttribute("data-text-on");

    state = state === "true";

    let checkbox = document.createElement("input");
    let label = document.createElement("label");

    let id = "checkbox-" + topic;
    checkbox.id = id;
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = state;

    label.setAttribute("for", id);
    if (name) {
      label.className = "text";
      if (align) label.className += " " + align;
      label.textContent = name;
    }

    node.appendChild(checkbox);
    node.appendChild(label);

    this.node = node;
    this.topic = topic;
    this.checkbox = checkbox;

    checkbox.addEventListener(
      "change",
      function (e) {
        notify.call(this);
      }.bind(this),
    );

    buttons[topic] = this;
  };

  let getNode = function getNode(topic) {
    return buttons[topic].node;
  };

  let setValue = function setValue(topic, value) {
    let obj = buttons[topic];
    if (obj === undefined) return;

    obj.checkbox.checked = value;
    notify.call(obj);
  };

  let subscribe = function subscribe(topic, callback) {
    if (subscribers[topic] === undefined) subscribers[topic] = [];

    subscribers[topic].push(callback);
  };

  let unsubscribe = function unsubscribe(topic, callback) {
    subscribers[topic].indexOf(callback);
    subscribers[topic].splice(index, 1);
  };

  let notify = function notify() {
    if (subscribers[this.topic] === undefined) return;
    for (let i = 0; i < subscribers[this.topic].length; i++)
      subscribers[this.topic][i](this.checkbox.checked);
  };

  let init = function init() {
    let elem = document.querySelectorAll(".ui-checkbox");
    let size = elem.length;
    for (let i = 0; i < size; i++) new CheckBox(elem[i]);
  };

  return {
    init: init,
    setValue: setValue,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
  };
})();

window.addEventListener("load", function () {
  BorderImage.init();
});

let BorderImage = (function BorderImage() {
  let getElemById = document.getElementById.bind(document);

  let subject;
  let preview;
  let guidelines = [];
  let positions = ["top", "right", "bottom", "left"];

  let makeDraggable = function makeDraggable(elem) {
    let offsetTop;
    let offsetLeft;

    elem.setAttribute("data-draggable", "true");

    let dragStart = function dragStart(e) {
      if (
        e.target.getAttribute("data-draggable") !== "true" ||
        e.target !== elem ||
        e.button !== 0
      )
        return;

      offsetLeft = e.clientX - elem.offsetLeft;
      offsetTop = e.clientY - elem.offsetTop;

      document.addEventListener("mousemove", mouseDrag);
      document.addEventListener("mouseup", dragEnd);
    };

    let dragEnd = function dragEnd(e) {
      if (e.button !== 0) return;

      document.removeEventListener("mousemove", mouseDrag);
      document.removeEventListener("mouseup", dragEnd);
    };

    let mouseDrag = function mouseDrag(e) {
      elem.style.left = e.clientX - offsetLeft + "px";
      elem.style.top = e.clientY - offsetTop + "px";
    };

    elem.addEventListener("mousedown", dragStart, false);
  };

  let PreviewControl = (function PreviewControl() {
    let dragging = false;
    let valueX = null;
    let valueY = null;

    let dragStart = function dragStart(e) {
      if (e.button !== 0) return;

      valueX = e.clientX - preview.clientWidth;
      valueY = e.clientY - preview.clientHeight;
      dragging = true;

      document.addEventListener("mousemove", mouseDrag);
    };

    let dragEnd = function dragEnd(e) {
      if (e.button !== 0 || dragging === false) return;

      document.removeEventListener("mousemove", mouseDrag);
      dragging = false;
    };

    let mouseDrag = function mouseDrag(e) {
      InputSliderManager.setValue("preview-width", e.clientX - valueX);
      InputSliderManager.setValue("preview-height", e.clientY - valueY);
    };

    let init = function init() {
      makeDraggable(preview);
      makeDraggable(subject);

      let handle = document.createElement("div");
      handle.className = "resize-handle";

      handle.addEventListener("mousedown", dragStart);
      document.addEventListener("mouseup", dragEnd);

      preview.appendChild(handle);
    };

    return {
      init: init,
    };
  })();

  let ImageReader = (function ImageReader() {
    let fReader = new FileReader();
    let browse = document.createElement("input");

    let loadImage = function loadImage(e) {
      if (browse.files.length === 0) return;

      let file = browse.files[0];

      if (file.type.slice(0, 5) !== "image") return;

      fReader.readAsDataURL(file);

      return false;
    };

    fReader.onload = function (e) {
      ImageControl.loadRemoteImage(e.target.result);
    };

    let load = function load() {
      browse.click();
    };

    browse.setAttribute("type", "file");
    browse.style.display = "none";
    browse.onchange = loadImage;

    return {
      load: load,
    };
  })();

  let ImageControl = (function ImageControl() {
    let scale = 0.5;
    let imgSource = new Image();
    let imgState = null;
    let selected = null;

    let topics = ["slice", "width", "outset"];
    let properties = {};
    properties["border1"] = {
      fill: false,

      slice_values: [27, 27, 27, 27],
      width_values: [20, 20, 20, 20],
      outset_values: [0, 0, 0, 0],

      slice_units: [0, 0, 0, 0],
      width_units: [0, 0, 0, 0],
      outset_units: [0, 0, 0, 0],

      repeat: [0, 0],
      size: [300, 200],
      preview_area: 400,
    };

    properties["border2"] = {
      fill: false,

      slice_values: [33, 33, 33, 33],
      width_values: [1.5, 1.5, 1.5, 1.5],
      outset_values: [0, 0, 0, 0],

      slice_units: [1, 1, 1, 1],
      width_units: [2, 2, 2, 2],
      outset_units: [0, 0, 0, 0],

      repeat: [2, 2],
      size: [300, 200],
      preview_area: 400,
    };

    properties["border3"] = {
      fill: true,

      slice_values: [15, 15, 15, 15],
      width_values: [10, 10, 10, 10],
      outset_values: [0, 0, 0, 0],

      slice_units: [0, 0, 0, 0],
      width_units: [0, 0, 0, 0],
      outset_units: [0, 0, 0, 0],

      repeat: [2, 2],
      size: [300, 200],
      preview_area: 400,
    };

    properties["border4"] = {
      fill: false,

      slice_values: [13, 13, 13, 13],
      width_values: [13, 13, 13, 13],
      outset_values: [13, 13, 13, 13],

      slice_units: [0, 0, 0, 0],
      width_units: [0, 0, 0, 0],
      outset_units: [0, 0, 0, 0],

      repeat: [1, 1],
      size: [300, 200],
      preview_area: 400,
    };

    properties["border5"] = {
      fill: false,

      slice_values: [12, 12, 12, 12],
      width_values: [12, 12, 12, 12],
      outset_values: [0, 0, 0, 0],

      slice_units: [0, 0, 0, 0],
      width_units: [0, 0, 0, 0],
      outset_units: [0, 0, 0, 0],

      repeat: [1, 1],
      size: [300, 200],
      preview_area: 400,
    };

    properties["border6"] = {
      fill: false,

      slice_values: [42, 42, 42, 42],
      width_values: [42, 42, 42, 42],
      outset_values: [0, 0, 0, 0],

      slice_units: [0, 0, 0, 0],
      width_units: [0, 0, 0, 0],
      outset_units: [0, 0, 0, 0],

      repeat: [2, 2],
      size: [350, 350],
      preview_area: 500,
    };

    let loadLocalImage = function loadLocalImage(source) {
      let location = "images/" + source;
      imgSource.src = location;
    };

    let loadRemoteImage = function loadRemoteImage(source) {
      imgSource.src = source;
      if (selected) selected.removeAttribute("selected");
      Tool.setOutputCSS("source", 'url("' + source + '")');
    };

    let pickImage = function pickImage(e) {
      if (e.target.className === "image") {
        selected = e.target;
        selected.setAttribute("selected", "true");
        loadRemoteImage(e.target.src);
        imgState = e.target.getAttribute("data-stateID");
      }
    };

    let loadImageState = function loadImageState(stateID) {
      if (properties[stateID] === undefined) return;

      let prop = properties[stateID];
      let topic;
      let unit_array;
      let value_array;

      for (let i in topics) {
        for (let j = 0; j < 4; j++) {
          topic = topics[i] + "-" + positions[j];
          unit_array = topics[i] + "_units";
          value_array = topics[i] + "_values";
          InputSliderManager.setValue(topic, prop[value_array][j]);
          DropDownManager.setValue(topic, prop[unit_array][j]);
        }
      }

      ButtonManager.setValue("slice-fill", prop["fill"]);
      DropDownManager.setValue("image-repeat-X", prop["repeat"][0]);
      DropDownManager.setValue("image-repeat-Y", prop["repeat"][1]);
      InputSliderManager.setValue("preview-width", prop["size"][0]);
      InputSliderManager.setValue("preview-height", prop["size"][1]);
      InputSliderManager.setValue("preview-area-height", prop["preview_area"]);
    };

    let update = function update() {
      scale = Math.min(300, (30000 / this.width) | 0);
      setScale(scale);
      InputSliderManager.setValue("scale", scale, false);

      subject.style.backgroundImage = 'url("' + this.src + '")';
      preview.style.borderImageSource = 'url("' + this.src + '")';

      guidelines["slice-top"].setMax(this.height);
      guidelines["slice-right"].setMax(this.width);
      guidelines["slice-bottom"].setMax(this.height);
      guidelines["slice-left"].setMax(this.width);

      if (imgState) loadImageState(imgState);
    };

    let setScale = function setScale(value) {
      scale = value;
      let w = ((imgSource.width * scale) / 100) | 0;
      let h = ((imgSource.height * scale) / 100) | 0;
      subject.style.width = w + "px";
      subject.style.height = h + "px";

      for (let i = 0; i < positions.length; i++)
        guidelines["slice-" + positions[i]].updateGuidelinePos();
    };

    let getScale = function getScale() {
      return scale / 100;
    };

    let toggleGallery = function toggleGallery() {
      let gallery = getElemById("image-gallery");
      let button = getElemById("toggle-gallery");
      let state = 1;
      button.addEventListener("click", function () {
        state = 1 ^ state;
        if (state === 0) {
          gallery.setAttribute("data-collapsed", "true");
          button.setAttribute("data-action", "show");
        } else {
          gallery.removeAttribute("data-collapsed");
          button.setAttribute("data-action", "hide");
        }
      });
    };

    let init = function init() {
      let gallery = getElemById("image-gallery");
      let browse = getElemById("load-image");
      let remote = getElemById("remote-url");
      let load_remote = getElemById("load-remote");

      remote.addEventListener("change", function () {
        loadRemoteImage(this.value);
      });

      load_remote.addEventListener("click", function () {
        loadRemoteImage(remote.value);
      });

      browse.addEventListener("click", ImageReader.load);
      gallery.addEventListener("click", pickImage);
      imgSource.addEventListener("load", update);

      InputSliderManager.subscribe("scale", setScale);
      InputSliderManager.setValue("scale", scale);
      imgState = "border1";
      loadRemoteImage("border-image-1.png");
      toggleGallery();
    };

    return {
      init: init,
      getScale: getScale,
      loadRemoteImage: loadRemoteImage,
    };
  })();

  let GuideLine = function GuideLine(node) {
    let topic = node.getAttribute("data-topic");
    let axis = node.getAttribute("data-axis");

    this.node = node;
    this.topic = topic;
    this.axis = axis;
    this.info = topic.split("-")[1];

    this.position = 0;
    this.value = 0;
    this.unit = 0;
    this.max = 0;
    this.pos = positions.indexOf(this.info);

    guidelines[topic] = this;

    let relative_container = document.createElement("div");
    let tooltip = document.createElement("div");
    let tooltip2 = document.createElement("div");

    tooltip.className = "tooltip";
    tooltip.setAttribute("data-info", this.info);

    tooltip2.className = "tooltip2";
    tooltip2.textContent = this.info;
    tooltip2.setAttribute("data-info", this.info);

    this.tooltip = tooltip;

    relative_container.appendChild(tooltip);
    relative_container.appendChild(tooltip2);
    node.appendChild(relative_container);

    let startX = 0;
    let startY = 0;
    let start = let
    let startDrag = function startDrag(e) {
      startX = e.clientX;
      startY = e.clientY;
      start = guidelines[topic].position;
      document.body.setAttribute("data-move", axis);
      relative_container.setAttribute("data-active", "");
      node.setAttribute("data-active", "");

      document.addEventListener("mousemove", updateGuideline);
      document.addEventListener("mouseup", endDrag);
    };

    let endDrag = function endDrag() {
      document.body.removeAttribute("data-move");
      relative_container.removeAttribute("data-active");
      node.removeAttribute("data-active");

      document.removeEventListener("mousemove", updateGuideline);
    };

    let updateGuideline = function updateGuideline(e) {
      let value;
      if (topic === "slice-top") value = e.clientY - startY + start;

      if (topic === "slice-right") value = startX - e.clientX + start;

      if (topic === "slice-bottom") value = startY - e.clientY + start;

      if (topic === "slice-left") value = e.clientX - startX + start;

      if (this.unit === 0)
        InputSliderManager.setValue(
          topic,
          ((value * 1) / ImageControl.getScale()) | 0,
        );
      else {
        InputSliderManager.setValue(
          topic,
          ((value * 100) / (this.max * ImageControl.getScale())) | 0,
        );
      }
    }.bind(this);

    node.addEventListener("mousedown", startDrag);

    InputSliderManager.subscribe(topic, this.setPosition.bind(this));
    InputSliderManager.setValue(topic, this.position);
  };

  GuideLine.prototype.updateGuidelinePos = function updateGuidelinePos() {
    if (this.unit === 0)
      this.position = (this.value * ImageControl.getScale()) | 0;
    else
      this.position =
        ((this.value * this.max * ImageControl.getScale()) / 100) | 0;

    this.node.style[this.info] = this.position + "px";
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
    if (this.unit === 1) InputSliderManager.setMax(this.topic, 100);
    else InputSliderManager.setMax(this.topic, this.max);
  };

  GuideLine.prototype.setUnit = function setUnit(type) {
    if (type === "%") this.unit = 1;
    if (type === "") this.unit = 0;
    this.updateLimit();
  };

  /*
   * Unit panel
   */
  let UnitPanel = (function UnitPanel() {
    let panel;
    let title;
    let precision;
    let step;
    let unit_topic = null; // settings are made for this topic
    let step_option = [1, 0.1, 0.01];

    let updatePrecision = function updatePrecision(value) {
      InputSliderManager.setPrecision("unit-step", value);
      InputSliderManager.setStep("unit-step", step_option[value]);
      InputSliderManager.setMin("unit-step", step_option[value]);

      if (unit_topic) InputSliderManager.setPrecision(unit_topic, value);
    };

    let updateUnitSettings = function updateUnitSettings(value) {
      if (unit_topic) InputSliderManager.setStep(unit_topic, value);
    };

    let show = function show(e) {
      let topic = e.target.getAttribute("data-topic");
      let precision = InputSliderManager.getPrecision(topic);
      let step = InputSliderManager.getStep(topic);

      unit_topic = topic;
      title.textContent = topic;

      panel.setAttribute("data-active", "true");
      panel.style.top = e.target.offsetTop - 40 + "px";
      panel.style.left = e.target.offsetLeft + 30 + "px";

      InputSliderManager.setValue("unit-precision", precision);
      InputSliderManager.setValue("unit-step", step);
    };

    let init = function init() {
      panel = document.createElement("div");
      title = document.createElement("div");
      let close = document.createElement("div");

      step = InputSliderManager.createSlider("unit-step", "step");
      precision = InputSliderManager.createSlider(
        "unit-precision",
        "precision",
      );

      InputSliderManager.setStep("unit-precision", 1);
      InputSliderManager.setMax("unit-precision", 2);
      InputSliderManager.setValue("unit-precision", 2);
      InputSliderManager.setSensitivity("unit-precision", 20);

      InputSliderManager.setValue("unit-step", 1);
      InputSliderManager.setStep("unit-step", 0.01);
      InputSliderManager.setPrecision("unit-step", 2);

      InputSliderManager.subscribe("unit-precision", updatePrecision);
      InputSliderManager.subscribe("unit-step", updateUnitSettings);

      close.addEventListener("click", function () {
        panel.setAttribute("data-active", "false");
      });

      title.textContent = "Properties";
      title.className = "title";
      close.className = "close";
      panel.id = "unit-settings";
      panel.setAttribute("data-active", "false");
      panel.appendChild(title);
      panel.appendChild(precision);
      panel.appendChild(step);
      panel.appendChild(close);
      document.body.appendChild(panel);
    };

    return {
      init: init,
      show: show,
    };
  })();

  /**
   * Tool Manager
   */
  let Tool = (function Tool() {
    let preview_area;
    let dropdown_unit_options = [
      { "": "--", "%": "%" },
      { px: "px", "%": "%", em: "em" },
      { px: "px", em: "em" },
    ];

    let border_slice = [];
    let border_width = [];
    let border_outset = [];

    let border_slice_values = [];
    let border_width_values = [];
    let border_outset_values = [];

    let border_slice_units = ["", "", "", ""];
    let border_width_units = ["px", "px", "px", "px"];
    let border_outset_units = ["px", "px", "px", "px"];

    let border_fill = false;
    let border_repeat = ["round", "round"];
    let CSS_code = {
      source: null,
      slice: null,
      width: null,
      outset: null,
      repeat: null,
    };

    let setBorderSlice = function setBorderSlice(positionID, value) {
      border_slice[positionID] = value + border_slice_units[positionID];
      updateBorderSlice();
    };

    let updateBorderSlice = function updateBorderSlice() {
      let value = border_slice.join(" ");
      if (border_fill === true) value += " fill";

      preview.style.borderImageSlice = value;
      setOutputCSS("slice", value);
    };

    let setBorderFill = function setBorderFill(value) {
      border_fill = value;
      let bimgslice = border_slice.join(" ");
      if (value === true) bimgslice += " fill";

      preview.style.borderImageSlice = bimgslice;
    };

    let updateBorderWidth = function updateBorderWidth() {
      let value = border_width.join(" ");
      preview.style.borderImageWidth = value;
      setOutputCSS("width", value);
    };

    let updateBorderOutset = function updateBorderOutset() {
      let value = border_outset.join(" ");
      preview.style.borderImageOutset = border_outset.join(" ");
      setOutputCSS("outset", value);
    };

    let setBorderRepeat = function setBorderRepeat(obj) {
      border_repeat[obj.value] = obj.name;
      let value = border_repeat.join(" ");
      preview.style.borderImageRepeat = value;
      setOutputCSS("repeat", value);
    };

    let setOutputCSS = function setOutputCSS(topic, value) {
      CSS_code[topic].textContent = value + ";";
    };

    let setPreviewFontSize = function setPreviewFontSize(value) {
      preview.style.fontSize = value + "px";
    };

    let setPreviewWidth = function setPreviewWidth(value) {
      preview.style.width = value + "px";
    };

    let setPreviewHeight = function setPreviewHeight(value) {
      preview.style.height = value + "px";
    };

    let setPreviewAreaHeight = function setPreviewAreaHeight(value) {
      preview_area.style.height = value + "px";
    };

    let updateDragOption = function updateDragOption(value) {
      if (value === true) subject.setAttribute("data-draggable", "true");
      else subject.removeAttribute("data-draggable");
    };

    let createProperty = function createProperty(topic, labelID, optionsID) {
      let slider = InputSliderManager.createSlider(topic, positions[labelID]);
      let dropdown = DropDownManager.createDropDown(
        topic,
        dropdown_unit_options[optionsID],
      );

      InputSliderManager.setSensitivity(topic, 3);
      InputSliderManager.setPrecision(topic, 1);

      let property = document.createElement("div");
      let config = document.createElement("div");

      property.className = "property";
      config.className = "config";
      config.setAttribute("data-topic", topic);
      config.addEventListener("click", UnitPanel.show);

      property.appendChild(slider);
      property.appendChild(dropdown);
      property.appendChild(config);

      return property;
    };

    let initBorderSliceControls = function initBorderSliceControls() {
      let container = getElemById("border-slice-control");

      let listenForChanges = function listenForChanges(topic, id) {
        InputSliderManager.subscribe(topic, function (value) {
          border_slice_values[id] = value;
          border_slice[id] = value + border_slice_units[id];
          updateBorderSlice();
        });

        DropDownManager.subscribe(topic, function (obj) {
          guidelines[topic].setUnit(obj.value);
          border_slice_units[id] = obj.value;
          border_slice[id] = border_slice_values[id] + obj.value;
          updateBorderSlice();
        });
      };

      for (let i = 0; i < positions.length; i++) {
        let topic = "slice-" + positions[i];
        let property = createProperty(topic, i, 0);
        listenForChanges(topic, i);

        container.appendChild(property);
      }

      container.appendChild(container.children[1]);
    };

    let initBorderWidthControls = function initBorderWidthControls() {
      let container = getElemById("border-width-control");

      let listenForChanges = function listenForChanges(topic, id) {
        InputSliderManager.subscribe(topic, function (value) {
          border_width_values[id] = value;
          border_width[id] = value + border_width_units[id];
          updateBorderWidth();
        });

        DropDownManager.subscribe(topic, function (obj) {
          if (obj.value === "%") InputSliderManager.setMax(topic, 100);
          else InputSliderManager.setMax(topic, 1000);

          border_width_units[id] = obj.value;
          border_width[id] = border_width_values[id] + obj.value;
          updateBorderWidth();
        });
      };

      for (let i = 0; i < positions.length; i++) {
        let topic = "width-" + positions[i];
        let property = createProperty(topic, i, 1);
        InputSliderManager.setMax(topic, 1000);
        listenForChanges(topic, i);

        container.appendChild(property);
      }
    };

    let initBorderOutsetControls = function initBorderOutsetControls() {
      let container = getElemById("border-outset-control");

      let listenForChanges = function listenForChanges(topic, id) {
        InputSliderManager.subscribe(topic, function (value) {
          border_outset_values[id] = value;
          border_outset[id] = value + border_outset_units[id];
          updateBorderOutset();
        });

        DropDownManager.subscribe(topic, function (obj) {
          border_outset_units[id] = obj.value;
          border_outset[id] = border_outset_values[id] + obj.value;
          updateBorderOutset();
        });
      };

      for (let i = 0; i < positions.length; i++) {
        let topic = "outset-" + positions[i];
        let property = createProperty(topic, i, 2);
        InputSliderManager.setMax(topic, 1000);
        listenForChanges(topic, i);

        container.appendChild(property);
      }
    };

    let init = function init() {
      let gallery = (subject = getElemById("subject"));
      preview = getElemById("preview");
      preview_area = getElemById("preview_section");

      CSS_code["source"] = getElemById("out-border-source");
      CSS_code["slice"] = getElemById("out-border-slice");
      CSS_code["width"] = getElemById("out-border-width");
      CSS_code["outset"] = getElemById("out-border-outset");
      CSS_code["repeat"] = getElemById("out-border-repeat");

      initBorderSliceControls();
      initBorderWidthControls();
      initBorderOutsetControls();

      let elem = document.querySelectorAll(".guideline");
      let size = elem.length;
      for (let i = 0; i < size; i++) new GuideLine(elem[i]);

      PreviewControl.init();

      ButtonManager.subscribe("slice-fill", setBorderFill);
      ButtonManager.subscribe("drag-subject", updateDragOption);
      ButtonManager.setValue("drag-subject", false);

      DropDownManager.subscribe("image-repeat-X", setBorderRepeat);
      DropDownManager.subscribe("image-repeat-Y", setBorderRepeat);

      InputSliderManager.subscribe("preview-area-height", setPreviewAreaHeight);
      InputSliderManager.subscribe("preview-width", setPreviewWidth);
      InputSliderManager.subscribe("preview-height", setPreviewHeight);
      InputSliderManager.subscribe("font-size", setPreviewFontSize);
      InputSliderManager.setValue("preview-width", 300);
      InputSliderManager.setValue("preview-height", 200);
    };

    return {
      init: init,
      setOutputCSS: setOutputCSS,
      setBorderSlice: setBorderSlice,
    };
  })();

  /**
   * Init Tool
   */
  let init = function init() {
    InputSliderManager.init();
    DropDownManager.init();
    ButtonManager.init();
    UnitPanel.init();
    Tool.init();
    ImageControl.init();
  };

  return {
    init: init,
  };
})();
