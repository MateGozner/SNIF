import type { Metadata } from "next";
import ParksPage from "./ParksContent";

export const metadata: Metadata = {
  title: "Nearby Parks",
  description: "Find dog-friendly parks near you.",
  openGraph: {
    title: "Nearby Parks",
    description: "Find dog-friendly parks near you.",
  },
};

export default function Page() {
  return <ParksPage />;
}
