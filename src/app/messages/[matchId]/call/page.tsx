"use client";

import VideoCallClient from "@/components/chat/VideoCallClient";
import { useParams, useRouter } from "next/navigation";
import { use } from "react";

interface PageProps {
  searchParams: Promise<{ receiverId?: string }>;
}

export default function VideoCallPage({ searchParams }: PageProps) {
  const router = useRouter();
  const params = useParams();
  const resolvedSearchParams = use(searchParams);

  const matchId = params.matchId;
  const receiverId = resolvedSearchParams.receiverId;

  if (!matchId || !receiverId) {
    console.error("Missing required parameters");
    router.back();
    return null;
  }

  return (
    <VideoCallClient matchId={matchId as string} receiverId={receiverId} />
  );
}
