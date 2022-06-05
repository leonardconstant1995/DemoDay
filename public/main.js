const socket = io('/')
const videoGrid = document.getElementById('videoGrid')
var myID 
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.classList.add('myVideo')
myVideo.muted = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    console.log(call)
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log('script js line 23 runs')
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    alert(`${userId} joined the room`)
    connectToNewUser(userId, stream)
  })
  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    $("ul").append(`<li class=""><b>${myID}</b><br/>${message}</li>`);
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  alert(`${userId} left the room`)
  document.querySelectorAll('video').forEach(e =>{
    if(e.classList[0] !== "myVideo"){
      e.remove()
    }
  })
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  myID = id
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  video.classList.add(userId)
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}



const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}



// const socket = io('/')
// // const peers = {}
// // const myVideo = document.createElement('video')
// // myVideo.muted = true
// const PRE = "DELTA"
// const SUF = "MEET"
// var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// var secondGetUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// var local_stream;
// var screenStream;
// let peer
// var currentPeer = null
// var screenSharing = false
// if(joined === ""){
//   createRoom();
//   console.log('1st user joined room');
// }
// function createRoom(){
//   room_id = PRE + ROOM_ID + SUF;
//   console.log(room_id)
//   peer = new Peer(room_id)
//   peer.on('open', (id) => {
//     socket.emit('join-room', ROOM_ID, id)
//     console.log('my video added')
//     getUserMedia({ video: true, audio: true }, (stream) => {
//       local_stream = stream;
//       setLocalStream(local_stream)
//   }, (err) => {
//       console.log(err)
//   })

//   })

//   peer.on('call', (call) => {
//     call.answer(local_stream);
//     call.on('stream', (stream) => {
//         setRemoteStream(stream)
//     })
//     currentPeer = call;
//   })

//     socket.on('user-connected', userId =>{
//     console.log(`User connected: ${userId}` )
//     // connectToNewUser(userId, stream)
    
//   })
// }
 
// console.log(joined);
// if(joined === "joined"){
//   joinRoom();
//   console.log('2nd user joined room');
// }

// function joinRoom() {
//   room_id = PRE + ROOM_ID + SUF
//   console.log(room_id)
//   peer = new Peer()
//   peer.on('open', (id) => {
//     socket.emit('join-room', ROOM_ID, id)
//       console.log("Connected with Id: " + id)
//       secondGetUserMedia({ video: true, audio: true }, (stream) => {
//           local_stream = stream;
//           setLocalStream(local_stream)
//           let call = peer.call(room_id, stream)
//           console.log(call)
//           call.on('stream', (stream) => {
//               setRemoteStream(stream);
//           })
//           currentPeer = call;
//       }, (err) => {
//           console.log(err)
//       })

//   })
// }

// // socket.on('user-disconnected', userId => {
// //   if (peers[userId]) peers[userId].close()
// // })

// function setLocalStream(stream) {

//   let video = document.getElementById("local-video");
//   video.srcObject = stream;
//   video.muted = true;
//   video.play();
// }
// function setRemoteStream(stream) {

//   let video = document.getElementById("remote-video");
//   video.srcObject = stream;
//   video.play()//.then(()=>{console.log('hi')});
//   console.log('im working')
// }

// function startScreenShare() {
//   if (screenSharing) {
//       stopScreenSharing()
//   }
//   navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
//       screenStream = stream;
//       let videoTrack = screenStream.getVideoTracks()[0];
//       videoTrack.onended = () => {
//           stopScreenSharing()
//       }
//       if (peer) {
//           let sender = currentPeer.peerConnection.getSenders().find(function (s) {
//               return s.track.kind == videoTrack.kind;
//           })
//           sender.replaceTrack(videoTrack)
//           screenSharing = true
//       }
//       console.log(screenStream)
//   })
// }

// function stopScreenSharing() {
//   if (!screenSharing) return;
//   let videoTrack = local_stream.getVideoTracks()[0];
//   if (peer) {
//       let sender = currentPeer.peerConnection.getSenders().find(function (s) {
//           return s.track.kind == videoTrack.kind;
//       })
//       sender.replaceTrack(videoTrack)
//   }
//   screenStream.getTracks().forEach(function (track) {
//       track.stop();
//   });
//   screenSharing = false
// }
// // navigator.mediaDevices.getUserMedia({
// //   video: true,
// //   audio: true
// // }).then(stream => {
// //   addVideoStream(myVideo, stream)

// //   myPeer.on('call', call => {
// //     console.log('video added')
// //     call.answer(stream)
// //     const video = document.createElement('video')
// //     call.on('stream', userVideoStream => {
// //       addVideoStream(video, userVideoStream)
// //     })
// //   })

// //   socket.on('user-connected', userId =>{
// //     console.log(`User connected: ${userId}` )
// //     connectToNewUser(userId, stream)
    
// //   })
// // })

// // socket.on('user-disconnected', userId => {
// //   if (peers[userId]) peers[userId].close()
// // })

// // myPeer.on('open', id => {
// //   socket.emit('join-room', ROOM_ID, id)
// // })

// // function connectToNewUser(userId, stream){
// //   const call = myPeer.call(userId, stream)
// //   const video = document.createElement('video')
// //   console.log('video element created')

// //   call.on("stream", userVideoStream => {
// //     console.log('function add video stream ran')
// //     addVideoStream(video, userVideoStream)
// //   })

// //   call.on('close', () => {
// //     video.remove()
// //   })
// // }

// // function addVideoStream(video, stream) {
// //   video.srcObject = stream
// //   video.addEventListener('loadedmetadata', ()=> {
// //     video.play()
// //   })
// //   videoGrid.appendChild(video)
// //   console.log('video appended')
// // }
