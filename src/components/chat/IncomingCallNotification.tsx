// components/CallNotification.tsx
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";
import { useVideo } from "@/contexts/signalR/VideoContext";

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
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="animate-pulse">
            <Phone className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Incoming Video Call</h2>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleDecline}
              className="flex items-center"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              Decline
            </Button>
            <Button onClick={handleAccept} className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
