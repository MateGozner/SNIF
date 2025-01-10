// app/matches/[matchId]/call/page.tsx
"use client";

import VideoCallClient from "@/components/chat/VideoCallClient";

interface PageProps {
  params: { matchId: string };
  searchParams: { receiverId: string };
}

export default function VideoCallPage({ params, searchParams }: PageProps) {
  return (
    <VideoCallClient
      matchId={params.matchId}
      receiverId={searchParams.receiverId}
    />
  );
}
