function redirectToCreateRoom(){
  window.location += "create";
}

function joinRoom(){
  var roomLink = document.getElementById("room-link").value;
  window.location = roomLink;
}
