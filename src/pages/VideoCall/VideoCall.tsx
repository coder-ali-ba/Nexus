import { useRef, useState } from "react";



const VideoCall = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const pc1 = useRef<RTCPeerConnection | null>(null);
  const pc2 = useRef<RTCPeerConnection | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);




const toggleMic = () => {
  if (!pc1.current) return;

  const sender = pc1.current
    .getSenders()
    .find(s => s.track?.kind === "audio");

  if (!sender || !sender.track) return;

  sender.track.enabled = !sender.track.enabled;
  setIsMicOn(sender.track.enabled);
};


// const toggleCamera = () => {
//   if (!localStream) return;

//   localStream.getVideoTracks().forEach((track) => {
//     track.enabled = !track.enabled;
//     setIsCameraOn(track.enabled);
//   });
// };

const toggleCamera = () => {
  if (!pc1.current) return;

  const sender = pc1.current
    .getSenders()
    .find(s => s.track?.kind === "video");

  if (!sender || !sender.track) return;

  sender.track.enabled = !sender.track.enabled;
  setIsCameraOn(sender.track.enabled);
};




  const startCall = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    //  const stream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true,
    // });

    setLocalStream(stream);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    // --- WebRTC Mock Setup ---
    pc1.current = new RTCPeerConnection();
    pc2.current = new RTCPeerConnection();

    // Send local tracks to pc1
    stream.getTracks().forEach((track) => {
      pc1.current?.addTrack(track, stream);
    });

    // When pc2 gets track → show in remote video
    pc2.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ICE exchange (loopback)
    pc1.current.onicecandidate = (e) => {
      if (e.candidate) pc2.current?.addIceCandidate(e.candidate);
    };

    pc2.current.onicecandidate = (e) => {
      if (e.candidate) pc1.current?.addIceCandidate(e.candidate);
    };

    // SDP exchange
    const offer = await pc1.current.createOffer();
    await pc1.current.setLocalDescription(offer);
    await pc2.current.setRemoteDescription(offer);

    const answer = await pc2.current.createAnswer();
    await pc2.current.setLocalDescription(answer);
    await pc1.current.setRemoteDescription(answer);


  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};


const endCall = () => {
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
  }

  if (localVideoRef.current) {
    localVideoRef.current.srcObject = null;
  }

  pc1.current?.close();
  pc2.current?.close();

  pc1.current = null;
  pc2.current = null;

  if (localVideoRef.current) localVideoRef.current.srcObject = null;
  if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

  setIsMicOn(true);
  setIsCameraOn(true);
};


const toggleScreenShare = async () => {
  if (!pc1.current) return;

  try {
    if (!isScreenSharing) {
      // Start screen share
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      // Replace camera track with screen track
      const sender = pc1.current
        .getSenders()
        .find((s) => s.track?.kind === "video");

      sender?.replaceTrack(screenTrack);

      // Show screen locally
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      // When user stops sharing from browser UI
      screenTrack.onended = () => {
        stopScreenShare();
      };

      setIsScreenSharing(true);
    } else {
      stopScreenShare();
    }
  } catch (err) {
    console.error("Screen share error:", err);
  }
};

const stopScreenShare = () => {
  if (!localStream || !pc1.current) return;

  const cameraTrack = localStream.getVideoTracks()[0];

  const sender = pc1.current
    .getSenders()
    .find((s) => s.track?.kind === "video");

  sender?.replaceTrack(cameraTrack);

  // Show camera again
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = localStream;
  }

  setIsScreenSharing(false);
};




 return (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
    {/* Video Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Local Video */}
      <div className="relative w-[320px] h-[200px] rounded-xl overflow-hidden bg-black shadow-lg">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
          You
        </span>
      </div>

      {/* Remote Video */}
      <div className="relative w-[320px] h-[200px] rounded-xl overflow-hidden bg-black shadow-lg">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
          Remote
        </span>
      </div>

    </div>

    {/* Controls */}
    <div className="flex gap-4 bg-gray-800 px-6 py-3 rounded-full shadow-xl">
      <button onClick={startCall} className="control-btn bg-green-600 p-2 rounded">
        Start
      </button>

      <button onClick={toggleMic} className="control-btn">
        {isMicOn ? "Mic" : "Mic Off"}
      </button>

      <button onClick={toggleCamera} className="control-btn">
        {isCameraOn ? "Cam" : "Cam Off"}
      </button>

      <button onClick={toggleScreenShare} className="control-btn">
        Share
      </button>

      <button onClick={endCall} className="control-btn bg-red-600 p-2 rounded">
        End
      </button>
    </div>
  </div>
);

};

export default VideoCall;
