var element = document.getElementById("example-element");

function applyCode(code) {
  element.style.cssText = code;
  if (!element.style.cssText) {
    console.log("bad style");
  } else {
    console.log(element.style.cssText);
  }
}


var exampleChoices = document.querySelectorAll(".example-choice");

function choose(choice) {
  choice.classList.add("selected");
  choice.setAttribute("contentEditable", true);
  choice.focus();
  applyCode(choice.textContent); 
}

function onChoose(e) {
  for (exampleChoice of exampleChoices) {
    exampleChoice.classList.remove("selected");
  }
  choose(e.currentTarget);
}

function onEdit(e) {
  applyCode(e.target.textContent); 
}

for (exampleChoice of exampleChoices) {
  exampleChoice.addEventListener("click", onChoose);
  exampleChoice.addEventListener("keyup", onEdit);
}

choose(exampleChoices[0]);
