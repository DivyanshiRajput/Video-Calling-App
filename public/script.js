const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {

    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream);
    });

    let text = $('input')

    $('html').keydown((e) => {
        if (e.which == 13 && text.val() != 0){
            console.log(text.val());
            socket.emit('message', text.val());
            text.val('')
        }
    })

    socket.on('createMessage', function(message){
        
        $('ul').append(`<li class ="message"><b>user</b><br/>${message}</li>`)
        scrollBottom();
        console.log("this is coming from server");
    })
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = function(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', function(){
        video.play();
    });
    videoGrid.append(video);
}

const scrollBottom = () => {
    var d = $('.chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

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

