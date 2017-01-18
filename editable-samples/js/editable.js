var element = document.getElementById("example-element");
var input = document.getElementById("input");
var reset = document.getElementById("reset");
var edit = document.getElementById("edit");
var code = input.value;

function applyCode() {
  element.style.cssText = input.value;
}

reset.addEventListener("click", function() {
  input.value = code;
  applyCode();
});

function setSelection() {
  var start = input.value.indexOf(":") + 1;
  if ((input.value.length > start) && (input.value[start] === " ")) {
    start++;
  }

  var end = input.value.length - 1;
  if ((input.value.length > 0) && (input.value[end-1] === ";")) {
    end--;
  }

  input.setSelectionRange(start, end);
}

edit.addEventListener("click", function() {
  input.focus();
  setSelection();
});

input.addEventListener("input", applyCode);
window.addEventListener("load", applyCode);
