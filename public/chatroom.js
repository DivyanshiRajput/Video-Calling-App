const socket = io('/');

// creating fake media stream
const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
};

const createEmptyVideoTrack = ({ width, height }) => {
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  canvas.getContext('2d').fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, { enabled: false });
};

const audioTrack = createEmptyAudioTrack();
const videoTrack = createEmptyVideoTrack({ width:0, height:0 });
const mediaStream = new MediaStream([audioTrack, videoTrack]);

// const user = prompt("Enter your name:");
let user;
if (localStorage.getItem("user") != null){
  user = localStorage.getItem("user");
  user += " 💬";
}

else{
  user = "";
  while(user == ""){
    user = prompt("Enter your name:");
  }
  if (user == null){
    window.history.back();
  }
  localStorage.setItem("user", user);
  user += " 💬";
}

var currentUserId;
var userList = [];

// setting up firebase
var firebaseConfig = FIREBASE_CONFIG;
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const room_ref = db.ref("Chatroom/" + ROOM_ID);
const sorted_room_ref = db.ref("Chatroom/" + ROOM_ID).orderByChild('timestamp');

sorted_room_ref.once('value',(snap) => {
  var messages = snap.val();

  Object.keys(messages).forEach(function (key){
    if (messages[key]['userName'] === user.substring(0, user.length -3)){
      $('#all_messages').append(`<li class ="messageRight">${messages[key]['message']}<span class="timestamp">${timestampConverter(messages[key]['timestamp'])}</span></li>`);
    }
    else{
      $('#all_messages').append(`<li class ="messageLeft"><b>${messages[key]['userName']}</b><br/>${messages[key]['message']}<span class="timestamp">${timestampConverter(messages[key]['timestamp'])}</span></li>`);
    }
  });
  scrollBottom();
});

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443',
});

peer.on('open', id => {
    currentUserId = id;
    userList = userList.concat(user);
    updateParticipantsList();
    socket.emit('join-room', ROOM_ID, id, user, "chat");
});

peer.on('call', call => {
    call.answer(mediaStream);
    userList = userList.concat(call.metadata.userName);
    updateParticipantsList();
});


peer.on('close', id => {
    socket.emit ('disconnect', id);
})

socket.on('user-connected', (userId, userName) => {
    userList = userList.concat(userName);
    updateParticipantsList();
    connectToNewUser(userId, mediaStream);
});

socket.on('user-connected-chat', (userId, userName) => {
    userList = userList.concat(userName);
    updateParticipantsList();
    connectToNewUser(userId, mediaStream);
});

socket.on('user-disconnected', (userId, userName) => {
    const index = userList.indexOf(userName);
    if (index > -1) {
    userList.splice(index, 1);
    }
    updateParticipantsList();
});

const connectToNewUser = (userId, mediaStream) => {
  options = {metadata: {"userName":user}};
  setTimeout(function() {
  const call = peer.call(userId, mediaStream, options);
  }, 1000);
};


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

const timestampConverter = (timestamp) =>{

    var date = new Date(timestamp);
    // date = date.toLocalString(undefined, {timeZone: 'Asia/Kolkata'});
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;

  }

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
  if (userName === user.substring(0, user.length - 3)){
    $('#all_messages').append(`<li class ="messageRight">${message} <span class="timestamp">${timestampConverter(Date.now())}</span></li>`);
  }
  else{
    $('#all_messages').append(`<li class ="messageLeft"><b>${userName}</b><br/>${message}<span class="timestamp">${timestampConverter(Date.now())}</span></li>`);
  }
  scrollBottom();
} );

// scroll function for chat box
const scrollBottom = () => {
    var d = $('.chat_window');
    d.scrollTop(d.prop("scrollHeight"));
};

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

// update chat in firebasejs
const updateChatFirebase = (userName, message) => {
  var ref = db.ref("Chatroom/" + ROOM_ID);
  var newMessage = {
    'userName':userName.substring(0, userName.length-3),
    'message':message.val(),
    'timestamp':Date.now()
  };
  ref.push(newMessage);
}

function gotoVideoRoom(){
  window.location.href = `../${ROOM_ID}`;
}
