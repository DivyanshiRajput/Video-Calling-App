const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
})

const addVideoStream = function(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', function(){
        video.play();
    });
    videoGrid.append(video);
}