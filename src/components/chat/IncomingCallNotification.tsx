// components/CallNotification.tsx
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Video } from "lucide-react";
import { useVideo } from "@/contexts/signalR/VideoContext";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

export default function CallNotification() {
  const router = useRouter();
  const { incomingCall, acceptCall, declineCall } = useVideo();

  const handleAccept = async () => {
    if (!incomingCall) return;
    await acceptCall(incomingCall.matchId, incomingCall.callerId);
    router.push(
      `/matches/${incomingCall.matchId}/call?receiverId=${incomingCall.callerId}`
    );
  };

  const handleDecline = async () => {
    if (!incomingCall) return;
    await declineCall(incomingCall.matchId);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && incomingCall) {
      handleDecline();
    }
  };

  if (!incomingCall?.isOpen) return null;

  return (
    <Dialog open={incomingCall.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden bg-gradient-to-b from-background/80 to-background backdrop-blur-2xl">
        <div className="relative flex flex-col items-center p-6">
          {/* Background Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background/20 animate-gradient" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),transparent)] animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="relative"
              >
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Caller" />
                  <AvatarFallback>
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Text Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-2"
            >
              <h2 className="text-xl font-semibold">Incoming Video Call</h2>
              <p className="text-sm text-muted-foreground">
                Someone wants to connect with you
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 w-full max-w-xs"
            >
              <Button
                variant="outline"
                onClick={handleDecline}
                className={cn(
                  "flex-1 h-12 rounded-full bg-background/50 backdrop-blur-sm",
                  "hover:bg-destructive/90 hover:text-destructive-foreground",
                  "transition-all duration-300 ease-out"
                )}
              >
                <PhoneOff className="h-5 w-5 mr-2" />
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                className={cn(
                  "flex-1 h-12 rounded-full bg-primary/90 hover:bg-primary",
                  "transition-all duration-300 ease-out"
                )}
              >
                <Phone className="h-5 w-5 mr-2" />
                Accept
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
