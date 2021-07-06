const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;

const user = prompt("Enter your name:");

var currentUserId;
var userList = [];

var firebaseConfig = FIREBASE_CONFIG;
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const room_ref = db.ref("Chatroom/" + ROOM_ID);
const sorted_room_ref = db.ref("Chatroom/" + ROOM_ID).orderByChild('timestamp');

sorted_room_ref.once('value',(snap) => {
  var messages = snap.val();

  Object.keys(messages).forEach(function (key){
    if (messages[key]['userName'] === user){
      $('#all_messages').append(`<li class ="messageRight">${messages[key]['message']}</li>`);
    }
    else{
      $('#all_messages').append(`<li class ="messageLeft">${messages[key]['userName']}<br/>${messages[key]['message']}</li>`);
    }
  });

});

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000',
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({ video: true, audio: false,})
.then(stream => {

    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    document.getElementsByTagName("video")[0].setAttribute("id", currentUserId);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        video.setAttribute('id', call.peer);

        userList = userList.concat(call.metadata.userName);
        updateParticipantsList();

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', (userId, userName) => {
        userList = userList.concat(userName);
        updateParticipantsList();
        connectToNewUser(userId, stream);
    });

    socket.on('user-disconnected', (userId, userName) => {
        const index = userList.indexOf(userName);
        if (index > -1) {
        userList.splice(index, 1);
        }
        updateParticipantsList();
        disconnectUser(userId, stream);
    })
});

const connectToNewUser = (userId, stream) => {
    options = {metadata: {"userName":user}};
    const call = peer.call(userId, stream, options);
    const video = document.createElement('video');
    video.setAttribute('id', userId);
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
};

const disconnectUser = (userId, stream) => {
  if (document.getElementById(userId) != null){
      document.getElementById(userId).remove();
  }
}

peer.on('open', id => {
    currentUserId = id;
    userList = userList.concat(user);
    updateParticipantsList();
    socket.emit('join-room', ROOM_ID, id, user);
});

peer.on('close', id => {
    socket.emit ('disconnect', id);
})

function leave(){
    if (window.confirm("Are you sure you want to leave the room?")){
        window.location += '/leave';
    }
    else{
        return;
    }
}

const updateParticipantsList = () => {
  var ele  = document.getElementById('participants-list');
  ele.innerHTML = '';
  userList.forEach((item, i) => {
    ele.innerHTML += "<li class='participant-list-item'>" + item +  "</li>";
  });
}

const addVideoStream = function(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', function(){
        video.play();
    });
    videoGrid.append(video);
}

// const addVideoStream = (video, stream, uId) => {
//     video.srcObject = stream;
//     video.id = uId;
//     video.addEventListener('loadedmetadata', function(){
//         video.play();
//     });
//     videoGrid.append(video);
//
//     let totalUsers = document.getElementsByTagName("video").length;
//     if(totalUsers > 1){
//         for (let i = 0; i < totalUsers; i++){
//             document.getElementsByTagName("video")[i].style.width = 100 / totalUsers + "%";
//             document.getElementsByTagName("video")[i].style.width = 50+ "%";
//             document.getElementsByTagName("video")[i].style.height = 50 + "%";
//         }}
// };

let text = $('#chat_message');

$("#send").click(() => {
    if (text.val() != 0)
    {
        updateChatFirebase(user, text);
        socket.emit('message', text.val());
        text.val('');
    }

});

$('html').keydown((e) => {
  if (e.which == 13 && text.val() != 0)
  {
      updateChatFirebase(user, text);
      socket.emit('message', text.val());
      text.val('')
  }
});

socket.on('createMessage', function(message, userName){

  if (userName === user){
    $('#all_messages').append(`<li class ="messageRight">${message}</li>`);
  }
  else{
    $('#all_messages').append(`<li class ="messageLeft">${userName}<br/>${message}</li>`);
  }

  scrollBottom();
  });

// scroll function for chat box
const scrollBottom = () => {
  console.log("hi");
    var d = $('.chat_window');
    d.scrollTop(d.prop("scrollHeight"));
};

//functioning of mute button
function setMuteButton(){
    const html = `
    <i class="fas fa-microphone"></i>
    <span> Mute </span>
    `
    document.querySelector('.mute').innerHTML = html;
}

function setUnmuteButton(){
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span> Unmute </span>
    `
    document.querySelector('.mute').innerHTML = html;
}

function muteFunction(){
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }

    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

//functioning of video button
function playVideo(){
    const html = `
    <i class="stopVideo fas fa-video-slash"></i>
    <span> Play Video </span>
    `
    document.querySelector('.video').innerHTML = html;

}

function stopVideo(){
    const html = `
    <i class="fas fa-video" aria-hidden="true"></i>
    <span> Stop Video </span>
    `
    document.querySelector('.video').innerHTML = html;
}

function videoFunction(){
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        playVideo();
    }

    else{
        stopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

// dark mode and light mode
const darkLight = () =>{
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")){
    const html = `
    <i class="fas fa-sun"></i>
    <span> Light Mode </span>
    `
    document.querySelector('#mode').innerHTML = html;
  }
  else {
    const html = `
    <i class="fas fa-moon"></i>
    <span> Dark Mode </span>
    `
    document.querySelector('#mode').innerHTML = html;
  }
}

// chat toggle window
const showChat = (e) => {
    if(document.body.classList.contains('showParticipants')){
      document.body.classList.toggle('showParticipants');
      document.getElementById('list_btn').classList.toggle("active");
    }

    e.classList.toggle("active");
    document.body.classList.toggle("showChat");
    scrollBottom();
};

//invite link popup functions
const showInvitePopup = () => {
    if (document.getElementById("invite").classList.contains("showInvite")){
        hideInvitePopup();
    }
    else{
        document.getElementById("invite").classList.add("showInvite");
        document.getElementById("invite_btn").classList.add("active");
        document.getElementById("roomLink").value = window.location.href;
    }
};

const hideInvitePopup = () => {
    document.getElementById("invite").classList.remove("showInvite");
    document.getElementById("invite_btn").classList.remove("active");
}

const copyToClipboard = () => {
    var copyText = document.getElementById("roomLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand('copy');

    alert("Copied: " + copyText.value );
    hideInvitePopup();
}

// show participants list
const showParticipants = (e) => {

    if(document.body.classList.contains('showChat')){
      document.body.classList.toggle('showChat');
      document.getElementById('chat_btn').classList.toggle("active");
    }
    document.body.classList.toggle("showParticipants");
    e.classList.toggle("active");

};

// update chat in firebasejs
const updateChatFirebase = (userName, message) => {
  var ref = db.ref("Chatroom/" + ROOM_ID);
  var newMessage = {
    'userName':userName,
    'message':message.val(),
    'timestamp':Date.now()
  };
  ref.push(newMessage);
}

// function shareScreen() {
//         if ( this.userMediaAvailable() ) {
//             return navigator.mediaDevices.getDisplayMedia( {
//                 video: {
//                    cursor: "always"
//                 },
//                 audio: {
//                     echoCancellation: true,
//                     noiseSuppression: true,
//                     sampleRate: 44100
//                 }
//             } );
//         }

//         else {
//             throw new Error( 'User media not available' );
//         }
// }
