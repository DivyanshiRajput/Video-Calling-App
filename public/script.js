const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;

// const User = prompt("enter your name:");

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

let myVideoStream;
let currentUserId;
let pendingMsg = 0;
let peers = {};
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

navigator.mediaDevices.getUserMedia({ video: true, audio: true,})
.then(stream => {

    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
            console.log(peers);
        });
    });

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    });

    socket.on('user-disconnected', (userId) => {
        if (peers[userId]){
            peers[userId].close();
        }
        speakText(`user ${userId} leaved`);
    });

    let text = $('#chat_message');

    $("#send").click(() => {
        if (text.val() != 0)
        {
            socket.emit('message', text.val());
            text.val('');
        }

    });

    $('html').keydown((e) => {
        if (e.which == 13 && text.val() != 0){
            console.log(text.val());
            socket.emit('message', text.val());
            text.val('')
        }
    });

    socket.on('createMessage', function(message){

        $('ul').append(`<li class ="message">User<br/>${message}</li>`)
        scrollBottom();
        console.log("this is coming from server");
    });

    // socket.on("createMessage", (message, userName) => {
    //     messages.innerHTML =
    //         messages.innerHTML +
    //         `<div class="message">
    //             <b><i class="far fa-user-circle"></i> <span> ${
    //             userName === user ? "me" : userName
    //             }</span> </b>
    //             <span>${message}</span>
    //         </div>`;
    // });
});

peer.on('open', id => {
    currentUserId = id;
    socket.emit('join-room', ROOM_ID, id);
});

socket.on("disconnect", function(){
    socket.emit("leave-room", ROOM_ID, currentUserId);
});

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
};

// const addVideoStream = function(video, stream){
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', function(){
//         video.play();
//     });
//     videoGrid.append(video);
// }

const addVideoStream = (video, stream, uId) => {
    video.srcObject = stream;
    video.id = uId;
    video.addEventListener('loadedmetadata', function(){
        video.play();
    });
    videoGrid.append(video);

    let totalUsers = document.getElementsByTagName("video").length;
    if(totalUsers > 1){
        for (let i = 0; i < totalUsers; i++){
            document.getElementsByTagName("video")[i].style.width = 100 / totalUsers + "%";
            // document.getElementsByTagName("video")[i].style.width = 50+ "%";
            // document.getElementsByTagName("video")[i].style.height = 50 + "%";
        }}
};

const scrollBottom = () => {
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

// chat toggle window
const showChat = (e) => {
    e.classList.toggle("active");
    document.body.classList.toggle("showChat");
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

// function shareScreen() {
//         if ( this.userMediaAvailable() ) {
//             return navigator.mediaDevices.getDisplayMedia( {
//                 video: {
//                     cursor: "always"
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
