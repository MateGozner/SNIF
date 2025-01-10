// components/VideoCall.tsx
"use client";

import { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";
import { useVideo } from "@/contexts/signalR/VideoContext";

interface VideoCallProps {
  matchId: string;
  receiverId: string;
  onClose?: () => void;
}

export default function VideoCall({
  matchId,
  receiverId,
  onClose,
}: VideoCallProps) {
  const { localStream, remoteStream, startCall, endCall, callState } =
    useVideo();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleEndCall = () => {
    endCall();
    onClose?.();
  };

  const handleStartCall = () => {
    startCall(matchId, receiverId);
  };

  // Video call is shown when explicitly opened or when in a call
  const isVideoDialogOpen = !!onClose || callState === "connected";

  return (
    <Dialog open={isVideoDialogOpen} onOpenChange={handleEndCall}>
      <DialogContent className="sm:max-w-4xl">
        <div className="relative aspect-video bg-black rounded-lg">
          {callState === "connecting" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Local Video */}
          <div className="absolute bottom-4 right-4 w-32 aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg bg-black/50"
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            {callState === "idle" ? (
              <Button
                onClick={handleStartCall}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Phone className="h-4 w-4 mr-2" />
                Start Call
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleEndCall}>
                <PhoneOff className="h-4 w-4 mr-2" />
                End Call
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
