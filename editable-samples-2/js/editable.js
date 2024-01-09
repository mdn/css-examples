let element = document.getElementById("example-element");
let originalChoices = [];
let initialChoice = 0;

function applyCode(code, choice) {
  element.style.cssText = code;
  let errorIcon = choice.querySelector(".error");
  if (!element.style.cssText) {
    errorIcon.classList.remove("hidden");
  } else {
    errorIcon.classList.add("hidden");
  }
}

let exampleChoices = document.querySelectorAll(".example-choice");

function indexOf(exampleChoices, choice) {
  for (let i = 0; i < exampleChoices.length; i++) {
    if (exampleChoices[i] === choice) {
      return i;
    }
  }
  return -1;
}

function choose(choice) {
  choice.classList.add("selected");
  choice.firstChild.setAttribute("contentEditable", true);
  choice.firstChild.setAttribute("spellcheck", false);
  choice.firstChild.focus();
  applyCode(choice.textContent, choice);
}

function onChoose(e) {
  // highlght the code we are leaving
  let selected = document.querySelector(".selected");
  if (selected && e.currentTarget != selected) {
    let highlighted = Prism.highlight(
      selected.firstChild.textContent,
      Prism.languages.css,
    );
    selected.firstChild.innerHTML = highlighted;
  }
  if (selected) {
    let errorIcon = selected.querySelector(".error");
    if (errorIcon) {
      errorIcon.classList.add("hidden");
    }
  }
  for (exampleChoice of exampleChoices) {
    exampleChoice.classList.remove("selected");
  }
  choose(e.currentTarget);
}

function onEdit(e) {
  applyCode(e.currentTarget.textContent, e.currentTarget.parentNode);
}

function copyTextOnly(e) {
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);

  e.clipboardData.setData("text/plain", range.toString());
  e.clipboardData.setData("text/html", range.toString());
  e.preventDefault();
  e.stopPropagation();
}

document.addEventListener("cut", copyTextOnly);
document.addEventListener("copy", copyTextOnly);

for (exampleChoice of exampleChoices) {
  originalChoices.push(exampleChoice.textContent);
  if (exampleChoice.getAttribute("initial-choice")) {
    initialChoice = indexOf(exampleChoices, exampleChoice);
  }
  exampleChoice.addEventListener("click", onChoose);
  exampleChoice.firstChild.addEventListener("keyup", onEdit);
  exampleChoice.querySelector(".reset").addEventListener("click", function (e) {
    let choice = e.target.parentNode;
    let replacementText = originalChoices[indexOf(exampleChoices, choice)];
    let highlighted = Prism.highlight(replacementText, Prism.languages.css);
    choice.firstChild.innerHTML = highlighted;
  });
}

choose(exampleChoices[initialChoice]);
