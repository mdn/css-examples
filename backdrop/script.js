// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

window.addEventListener("load", doStartup, false);

function doStartup(event) {
  document.fullscreenElement = document.fullscreenElement || document.mozFullscreenElement
            || document.msFullscreenElement || document.webkitFullscreenDocument;
  document.exitFullscreen = document.exitFullscreen || document.mozExitFullscreen
            || document.msExitFullscreen || document.webkitExitFullscreen;
  
  document.addEventListener("keypress", handleKeypress, false);
}

function handleKeypress(event) {
  if (event.keyCode === 13) {
    toggleFullscreen();
  }
}


function toggleFullscreen() {
  let elem = document.querySelector("video");

  elem.requestFullscreen = elem.requestFullscreen || elem.mozRequestFullscreen
          || elem.msRequestFullscreen || elem.webkitRequestFullscreen;

  if (!document.fullscreenElement) {
    elem.requestFullscreen().then({}).catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}