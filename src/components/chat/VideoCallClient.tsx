"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useVideo } from "@/contexts/signalR/VideoContext";

interface VideoCallClientProps {
  matchId: string;
  receiverId: string;
}

export default function VideoCallClient({
  matchId,
  receiverId,
}: VideoCallClientProps) {
  const router = useRouter();
  const {
    startCall,
    endCall,
    localStream,
    remoteStream,
    isInCall,
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled,
  } = useVideo();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const initializeCall = async () => {
      try {
        if (!matchId || !receiverId) {
          console.error("❌ Missing matchId or receiverId");
          toast.error("Invalid call parameters");
          router.back();
          return;
        }

        await startCall(matchId, receiverId);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize call:", error);
        toast.error("Failed to start video call");
        router.back();
      }
    };

    initializeCall();

    return () => {
      if (isInitialized) {
        console.log("🧹 Cleaning up call on unmount");
        endCall(matchId);
      }
    };
  }, [matchId, receiverId, startCall, endCall, router, isInitialized]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log("🎥 Setting local video stream");
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log("🎥 Setting remote video stream");
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleEndCall = async () => {
    await endCall(matchId);
    router.back();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="container flex flex-col h-full max-w-5xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Video Call</h1>
          <div className="flex items-center gap-2">
            {isInCall && (
              <span className="flex items-center gap-2 text-sm text-green-500">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Connected
              </span>
            )}
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local video */}
          <div className="relative bg-muted rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-background/60 px-2 py-1 rounded-md backdrop-blur-sm">
              <span className="text-sm text-foreground">You</span>
            </div>
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90">
                <VideoOff className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Remote video */}
          <div className="relative bg-muted rounded-lg overflow-hidden shadow-lg">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-background/60 px-2 py-1 rounded-md backdrop-blur-sm">
              <span className="text-sm text-foreground">Partner</span>
            </div>
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90">
                <div className="flex flex-col items-center gap-2">
                  <Phone className="h-12 w-12 text-muted-foreground animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    Connecting...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 py-6">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleAudio}
            className={`rounded-full h-12 w-12 transition-colors ${
              !isAudioEnabled
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }`}
          >
            {isAudioEnabled ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={handleEndCall}
            className="rounded-full h-14 w-14 bg-destructive hover:bg-destructive/90"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleVideo}
            className={`rounded-full h-12 w-12 transition-colors ${
              !isVideoEnabled
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }`}
          >
            {isVideoEnabled ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
