let element = document.getElementById("example-element");
let input = document.getElementById("input");
let editor = document.getElementById("editor");
let editorContent = document.getElementById("editor-content");
let reset = document.getElementById("reset");

let cmOptions = {
  mode: "css",
  theme: "eclipse",
  lineNumbers: true,
  showCursorWhenSelecting: true,
};

let cmEditor = CodeMirror.fromTextArea(editorContent, cmOptions);
cmEditor.setSize("100%", 50);
cmEditor.focus();
cmEditor.doc.setCursor({ line: 0, pos: -1 });

function applyCode() {
  element.style.cssText = cmEditor.doc.getValue();
}

reset.addEventListener("click", function () {
  cmEditor.doc.setValue(cmInitContent);
  applyCode();
  reset.classList.add("hidden");
});

cmEditor.on("change", function () {
  reset.classList.remove("hidden");
  applyCode();
});

window.addEventListener("load", function () {
  applyCode();
});
