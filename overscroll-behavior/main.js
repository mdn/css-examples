// Generate fake contacts

let mainElem = document.querySelector('main');

for(var i = 1; i < 51; i++) {
  let divElem = document.createElement('div');
  let pElem = document.createElement('p');

  pElem.textContent = 'Contact ' + i;

  mainElem.appendChild(divElem);
  divElem.appendChild(pElem);
}

// Allow submission of chat messages

let form = document.querySelector('form');
let input = document.querySelector('input');
let messages = document.querySelector('.messages');
messages.scrollTop = messages.scrollHeight;

form.addEventListener('submit', e => {
  e.preventDefault();

  if(input.value !== '') {
    let pElem = document.createElement('p');
    pElem.setAttribute('class', 'me');
    pElem.textContent = 'Chris: ' + input.value;

    messages.appendChild(pElem);
    messages.scrollTop = messages.scrollHeight;

    input.value = '';
    input.focus();
  }
});
