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

    // old_avg = Number();
    // count = Number();
    // // update average
    // const avg_ref = db.ref('Average/avg');
    // avg_ref.once('value',(snap)=>{
    //   old_avg = snap.val()});
    //
    // const count_ref = db.ref('Average/count');
    // count_ref.once('value',(snap)=>{
    //   count = snap.val()});
    //
    // new_avg = ((old_avg * count) + temp )/(count + 1);
    // avg_ref.set(new_avg);
    //
    // count += 1;
    // count_ref.set(count);

    alert("Your feedback has been submitted.");
};
