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
    <div className="fixed inset-0 bg-gradient-to-b from-black/95 to-zinc-900/95 backdrop-blur-2xl">
      <div className="container relative flex flex-col h-full max-w-7xl mx-auto p-4">
        {/* Status Bar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-white/5">
            <div className="flex items-center gap-2">
              {isInCall ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#2997FF] animate-pulse" />
                  <span className="text-sm font-medium text-white">Live</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-sm font-medium text-white">
                    Connecting
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 py-8 md:py-12 relative min-h-screen">
          {/* Main Video (Remote) */}
          <div className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl bg-black/20">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl">
              <span className="text-sm font-medium text-white">Partner</span>
            </div>
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90 backdrop-blur-md">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-zinc-800/90 backdrop-blur-xl flex items-center justify-center ring-1 ring-white/10">
                    <Phone className="h-10 w-10 text-[#2997FF] animate-pulse" />
                  </div>
                  <span className="text-base font-medium text-white">
                    Connecting...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* PiP (Local Video) */}
          <div className="absolute top-6 right-6 w-[160px] md:w-[240px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-200 cursor-move">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90 backdrop-blur-md">
                <VideoOff className="h-8 w-8 text-white/60" />
              </div>
            )}
          </div>
        </div>

        {/* Control Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/[0.05] shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAudio}
              className={`
                relative flex items-center justify-center 
                w-14 h-14 rounded-full transition-all duration-200 
                backdrop-blur-xl hover:scale-105 active:scale-95 
                ${
                  !isAudioEnabled
                    ? "bg-red-500/20 text-white hover:bg-red-500/30 ring-1 ring-red-500/50"
                    : "bg-zinc-800/80 text-white hover:bg-zinc-700/80 ring-1 ring-white/10"
                }
              `}
            >
              {isAudioEnabled ? (
                <Mic className="h-6 w-6" />
              ) : (
                <MicOff className="h-6 w-6" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleEndCall}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
            >
              <PhoneOff className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVideo}
              className={`
                relative flex items-center justify-center 
                w-14 h-14 rounded-full transition-all duration-200 
                backdrop-blur-xl hover:scale-105 active:scale-95 
                ${
                  !isVideoEnabled
                    ? "bg-red-500/20 text-white hover:bg-red-500/30 ring-1 ring-red-500/50"
                    : "bg-zinc-800/80 text-white hover:bg-zinc-700/80 ring-1 ring-white/10"
                }
              `}
            >
              {isVideoEnabled ? (
                <Video className="h-6 w-6" />
              ) : (
                <VideoOff className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
