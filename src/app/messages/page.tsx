import type { Metadata } from "next";
import MessagesPage from "./MessagesContent";

export const metadata: Metadata = {
  title: "Messages",
  description: "Chat with other pet owners on SNIF.",
  openGraph: {
    title: "Messages",
    description: "Chat with other pet owners on SNIF.",
  },
};

export default function Page() {
  return <MessagesPage />;
}
