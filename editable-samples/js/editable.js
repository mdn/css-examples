var element = document.getElementById("example-element");
var input = document.getElementById("input");
var editor = document.getElementById("editor");
var editorContent = document.getElementById("editor-content");
var reset = document.getElementById("reset");

var cmOptions = {
  mode: "css",
  theme: "eclipse",
  lineNumbers: true,
  showCursorWhenSelecting: true
}

var cmEditor = CodeMirror.fromTextArea(editorContent, cmOptions);
cmEditor.setSize("100%", 50);
cmEditor.focus();
cmEditor.doc.setCursor({line:0, pos: -1});

function applyCode() {
  element.style.cssText = cmEditor.doc.getValue();
}

reset.addEventListener("click", function() {
  cmEditor.doc.setValue(cmInitContent);
  applyCode();
  reset.classList.add("hidden");
});

cmEditor.on("change", function() {
  reset.classList.remove("hidden");
  applyCode();
});

window.addEventListener("load", function() {
  applyCode();
});
