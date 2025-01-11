"use client";

import VideoCallClient from "@/components/chat/VideoCallClient";
import { useRouter } from "next/navigation";
import { use } from "react";

interface PageProps {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ receiverId?: string }>;
}

export default function VideoCallPage({ params, searchParams }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);

  const matchId = resolvedParams.matchId;
  const receiverId = resolvedSearchParams.receiverId;

  if (!matchId || !receiverId) {
    console.error("Missing required parameters");
    router.back();
    return null;
  }

  return <VideoCallClient matchId={matchId} receiverId={receiverId} />;
}
