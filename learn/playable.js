var section = document.querySelector("section");
var editable = document.querySelector(".editable");
var textareaHTML = document.querySelector(".playable-html");
var textareaCSS = document.querySelector(".playable-css");
var reset = document.getElementById("reset");
var htmlCode = textareaHTML.value;
var cssCode = textareaCSS.value;

let editorHeading = document.createElement("h4");
editorHeading.innerHTML = "Interactive editor";
document.querySelector("body").insertBefore(editorHeading, textareaCSS);

function fillCode() {
  editable.innerHTML = textareaCSS.value;
  section.innerHTML = textareaHTML.value;
}

reset.addEventListener("click", function () {
  textareaHTML.value = htmlCode;
  textareaCSS.value = cssCode;
  fillCode();
});

textareaHTML.addEventListener("input", fillCode);
textareaCSS.addEventListener("input", fillCode);
window.addEventListener("load", fillCode);
