import type { Metadata } from "next";
import HomePage from "./HomeContent";

export const metadata: Metadata = {
  title: "SNIF - Social Networking In Fur",
  description: "Connect your pets with others for playdates, breeding, and friendship.",
  openGraph: {
    title: "SNIF - Social Networking In Fur",
    description: "Connect your pets with others for playdates, breeding, and friendship.",
  },
};

export default function Page() {
  return <HomePage />;
}
