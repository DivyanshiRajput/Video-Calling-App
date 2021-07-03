var firebaseConfig = FIREBASE_CONFIG;
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const avg_ref = db.ref('Average/avg');
avg_ref.on('value',(snap)=>{
  document.getElementById('rating').innerHTML = 'Rated ' +  snap.val().toFixed(1) + '/5.0 ★';
});



function redirectToCreateRoom(){
  window.location += "create";
}

function joinRoom(){
  if (document.getElementById("room-link").value == ""){
    alert("Please enter a valid link.");
  }

  else {
    var roomLink = document.getElementById("room-link").value;
    window.location = roomLink;
  }
}

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
