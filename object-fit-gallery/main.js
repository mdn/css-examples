let thumbs = document.querySelectorAll(".thumb");
let mainImg = document.querySelector(".main");

for (i = 1; i <= thumbs.length; i++) {
  let requestObj = "images/pic" + i + ".jpg";
  retrieveImage(requestObj, i - 1);
}

function retrieveImage(requestObj, imageNo) {
  let request = new XMLHttpRequest();
  request.open("GET", requestObj, true);
  request.responseType = "blob";
  request.send();

  request.onload = function () {
    let objectURL = URL.createObjectURL(request.response);
    thumbs[imageNo].setAttribute("src", objectURL);
    thumbs[imageNo].onclick = function () {
      mainImg.setAttribute("src", objectURL);
      mainImg.className = "blowup";
      for (i = 0; i < thumbs.length; i++) {
        thumbs[i].className = "thumb darken";
      }
    };
  };
}

mainImg.onclick = function () {
  mainImg.className = "main";
  for (i = 0; i < thumbs.length; i++) {
    thumbs[i].className = "thumb";
  }
};
