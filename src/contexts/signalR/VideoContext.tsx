// contexts/VideoContext.tsx
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { useVideoHub } from "@/lib/signalR/videoHub";
import { toast } from "sonner";

interface IncomingCallState {
  callerId: string;
  matchId: string;
  isOpen: boolean;
}

interface VideoContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isInCall: boolean;
  isCaller: boolean;
  incomingCall: IncomingCallState | null;
  setIncomingCall: React.Dispatch<
    React.SetStateAction<IncomingCallState | null>
  >;
  startCall: (matchId: string, receiverId: string) => Promise<void>;
  acceptCall: (matchId: string, callerId: string) => Promise<void>;
  declineCall: (matchId: string) => Promise<void>;
  endCall: (matchId: string) => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

const VideoContext = createContext<VideoContextType | null>(null);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) throw new Error("useVideo must be used within a VideoProvider");
  return context;
};

interface VideoProviderProps {
  children: React.ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCallState | null>(
    null
  );
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const currentMatchId = useRef<string | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const {
    connection,
    sendSignal,
    initiateCall,
    acceptCall: acceptSignalRCall,
    endCall: endSignalRCall,
  } = useVideoHub();

  const setupPeerConnection = useCallback(async () => {
    if (peerConnection.current) {
      console.log("🔄 Peer connection already exists, cleaning up first");
      endCurrentCall();
    }

    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    console.log("🔧 Setting up new peer connection");
    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;

    try {
      console.log("📹 Requesting media devices");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      stream.getTracks().forEach((track) => {
        console.log("➕ Adding track to peer connection:", track.kind);
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        console.log("🎥 Received remote track", event.streams[0]);
        setRemoteStream(event.streams[0]);
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate && currentMatchId.current) {
          console.log("🧊 Sending ICE candidate");
          await sendSignal(
            currentMatchId.current,
            event.candidate,
            "ice-candidate"
          ).catch((err) => {
            console.error("Failed to send ICE candidate:", err);
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log("🌐 ICE Connection State:", pc.iceConnectionState);
      };

      pc.onicegatheringstatechange = () => {
        console.log("🌐 ICE Gathering State:", pc.iceGatheringState);
      };

      pc.onsignalingstatechange = () => {
        console.log("🌐 Signaling State:", pc.signalingState);
      };

      return pc;
    } catch (err) {
      console.error("❌ Error accessing media devices:", err);
      toast.error("Failed to access camera or microphone");
      throw err;
    }
  }, [sendSignal]);

  // Set up SignalR event handlers
  React.useEffect(() => {
    if (!connection) return;

    const handleIncomingCall = (callerId: string, matchId: string) => {
      console.log("📞 Incoming call from", callerId);
      setIncomingCall({
        callerId,
        matchId,
        isOpen: true,
      });
    };

    const handleCallAccepted = async (matchId: string) => {
      console.log("✅ Call accepted for match", matchId);
      setIsInCall(true);
    };

    const handleInitiateWebRTCOffer = async (matchId: string) => {
      console.log("🎯 Initiating WebRTC offer for match", matchId);
      if (!peerConnection.current) {
        console.error("No peer connection available");
        return;
      }

      try {
        const offer = await peerConnection.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        await peerConnection.current.setLocalDescription(offer);
        await sendSignal(matchId, offer, "offer");
      } catch (err) {
        console.error("Error creating offer:", err);
        toast.error("Failed to setup call");
      }
    };

    const handleSignal = async (signal: string, type: string) => {
      if (!currentMatchId.current || !peerConnection.current) {
        console.log("❌ No active call for signal");
        return;
      }

      try {
        const signalData = JSON.parse(signal);
        console.log("📡 Received signal:", type);

        switch (type) {
          case "offer":
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(signalData)
            );
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            await sendSignal(currentMatchId.current, answer, "answer");
            break;

          case "answer":
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(signalData)
            );
            break;

          case "ice-candidate":
            if (peerConnection.current.remoteDescription) {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(signalData)
              );
            } else {
              iceCandidatesQueue.current.push(new RTCIceCandidate(signalData));
            }
            break;
        }
      } catch (err) {
        console.error("❌ Error handling signal:", err);
      }
    };

    const handleCallEnded = (matchId: string) => {
      console.log("📞 Call ended for match", matchId);
      if (currentMatchId.current === matchId) {
        endCurrentCall();
        toast.info("Call ended");
        if (window.location.pathname.includes(`/matches/${matchId}/call`)) {
          window.history.back();
        }
      }
    };

    // Register SignalR event handlers
    connection.on("IncomingCall", handleIncomingCall);
    connection.on("CallAccepted", handleCallAccepted);
    connection.on("InitiateWebRTCOffer", handleInitiateWebRTCOffer);
    connection.on("ReceiveSignal", handleSignal);
    connection.on("CallEnded", handleCallEnded);

    return () => {
      // Cleanup SignalR event handlers
      connection.off("IncomingCall", handleIncomingCall);
      connection.off("CallAccepted", handleCallAccepted);
      connection.off("InitiateWebRTCOffer", handleInitiateWebRTCOffer);
      connection.off("ReceiveSignal", handleSignal);
      connection.off("CallEnded", handleCallEnded);
    };
  }, [connection, sendSignal]);

  const startCall = async (matchId: string, receiverId: string) => {
    try {
      if (currentMatchId.current === matchId) {
        console.log("🔄 Call already in progress for this match");
        return;
      }

      console.log("📞 Starting call to", receiverId);
      currentMatchId.current = matchId;
      setIsCaller(true);

      await setupPeerConnection();
      await initiateCall(matchId, receiverId);

      // Note: Don't create offer here - wait for InitiateWebRTCOffer event
    } catch (err) {
      console.error("❌ Error starting call:", err);
      toast.error("Failed to start call");
      endCurrentCall();
    }
  };

  const acceptCall = async (matchId: string, callerId: string) => {
    try {
      console.log("📞 Accepting call from", callerId);
      currentMatchId.current = matchId;
      setIsCaller(false);

      await setupPeerConnection();
      await acceptSignalRCall(matchId, callerId);

      setIncomingCall(null);
    } catch (err) {
      console.error("❌ Error accepting call:", err);
      toast.error("Failed to accept call");
      endCurrentCall();
    }
  };

  const declineCall = async (matchId: string) => {
    await endSignalRCall(matchId);
    setIncomingCall(null);
  };

  const endCall = async (matchId: string) => {
    if (currentMatchId.current === matchId) {
      await endSignalRCall(matchId);
      endCurrentCall();
    }
  };

  const endCurrentCall = () => {
    console.log("📞 Ending current call");
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
        console.log("🛑 Stopped track:", track.kind);
      });
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsInCall(false);
    setIsCaller(false);
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    currentMatchId.current = null;
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        localStream,
        remoteStream,
        isInCall,
        isCaller,
        incomingCall,
        setIncomingCall,
        startCall,
        acceptCall,
        declineCall,
        endCall,
        toggleAudio,
        toggleVideo,
        isAudioEnabled,
        isVideoEnabled,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
