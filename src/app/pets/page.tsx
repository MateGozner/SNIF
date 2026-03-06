import type { Metadata } from "next";
import PetsPage from "./PetsContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Pets",
  description: "Manage your pets on SNIF.",
  openGraph: {
    title: "My Pets",
    description: "Manage your pets on SNIF.",
  },
};

export default function Page() {
  return <PetsPage />;
}
