let section = document.querySelector("section");
let editable = document.querySelector(".editable");
let textareaHTML = document.querySelector(".playable-html");
let textareaCSS = document.querySelector(".playable-css");
let reset = document.getElementById("reset");
let htmlCode = textareaHTML.value;
let cssCode = textareaCSS.value;

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