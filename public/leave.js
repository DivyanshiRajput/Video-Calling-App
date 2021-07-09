var firebaseConfig = FIREBASE_CONFIG;
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const avg_ref = db.ref('Average/avg');
avg_ref.on('value',(snap)=>{
  document.getElementById('rating').innerHTML = snap.val().toFixed(1) + '/5.0 ★';
});

function rejoin(){
  window.history.back();
}

function returnToHome(){
    window.location.href = "../";
}

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

    // update average
    const avg_ref = db.ref('Average');

    avg_ref.once('value',(snap)=>{
      console.log(snap.val());

      old_avg = snap.val()['avg'];
      count = snap.val()['count'];

      console.log(old_avg);
      console.log(count);

      new_avg = ((old_avg * count) + temp )/(count + 1);
      count += 1;

      avg_ref.set({
        avg: new_avg,
        count: count
      });

    });

    alert("Your feedback has been submitted.");
};
