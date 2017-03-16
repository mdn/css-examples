var element = document.getElementById("example-element");
var input = document.getElementById("input");
var editor = document.getElementById("editor");
var reset = document.getElementById("reset");
var edit = document.getElementById("edit");

var cmOptions = {
  mode: "css",
  theme: "eclipse",
  lineNumbers: true,
  showCursorWhenSelecting: true
}

var cmEditor = CodeMirror(editor, cmOptions);
cmEditor.setSize("100%", 50);
cmEditor.doc.setValue(cmInitContent);

CodeMirror.hint.css = function(cm) {
  var inner = {from: cm.getCursor(), to: cm.getCursor(), list: []};
  
  var currentPos = cm.getCursor();
  var preceding = cm.getRange({line: currentPos.line, ch: 0}, currentPos);
  if (preceding == cmMatchToShowCompletions) {
    inner.list = cmCompletionChoices;
  }
  return inner;
};

function applyCode() {
  element.style.cssText = cmEditor.doc.getValue();
}

reset.addEventListener("click", function() {
  cmEditor.doc.setValue(cmInitContent);
  applyCode();
  reset.classList.add("hidden");
  edit.classList.remove("hidden");
});

function selectValue() {
  var value = cmEditor.doc.getValue();
  var start = value.indexOf(":") + 1;
  if ((value.length > start) && (value[start] === " ")) {
    start++;
  }

  var end = value.length - 1;
  if ((value.length > 0) && (value[end-1] === ";")) {
    end--;
  }

  cmEditor.doc.setSelection(
    {line: 0, ch: start},
    {line: 0, ch: end});
}

edit.addEventListener("click", function() {
  cmEditor.focus();
  selectValue();
  edit.classList.add("hidden");
  reset.classList.remove("hidden");
});

cmEditor.on("change", applyCode);
window.addEventListener("load", applyCode);

function showCompletions(cm, event) {
  var popupKeyCodes = {
      "9": "tab",
      "13": "enter",
      "27": "escape",
      "33": "pageup",
      "34": "pagedown",
      "35": "end",
      "36": "home",
      "38": "up",
      "40": "down"
  }

if(!popupKeyCodes[(event.keyCode || event.which).toString()]) {
    CodeMirror.showHint(cm, CodeMirror.hint.css, {completeSingle: false, closeOnUnfocus:false});
  }           
}

cmEditor.on("keyup", showCompletions);
