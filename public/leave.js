function rejoin(){
  window.history.back();
};

var firebaseConfig = {
    apiKey: "AIzaSyAF1i5MloeErcq7ErFcnEEsEg4CGM5Enps",
    authDomain: "teams-clone-a921c.firebaseapp.com",
    databaseURL: "https://teams-clone-a921c-default-rtdb.firebaseio.com",
    projectId: "teams-clone-a921c",
    storageBucket: "teams-clone-a921c.appspot.com",
    messagingSenderId: "24512433115",
    appId: "1:24512433115:web:85d0bd97e77414338e75fe",
    measurementId: "G-R1EGVPHZ3R"
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function addFeedback(){
  const ref = db.ref('Ratings/' + Date.now());
  if($("input[type='radio'][name='rating']:checked").val() > 0){
    var temp = $("input[type='radio'][name='rating']:checked").val();
    temp = Number(temp);
  }
  else{
    var temp = 0;
  }
  var newRating = {
    rating: temp,
  };

  ref.set(newRating);
  alert("Your feedback has been submitted.")
};
