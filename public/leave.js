function rejoin(){
    window.history.back();
};

function returnToHome(){
    window.location.href="../";
}

var firebaseConfig = FIREBASE_CONFIG;

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
