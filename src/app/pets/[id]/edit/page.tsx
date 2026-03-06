import type { Metadata } from "next";
import EditPetPage from "./EditPetContent";

export const metadata: Metadata = {
  title: "Edit Pet",
  description: "Edit your pet's profile on SNIF.",
  openGraph: {
    title: "Edit Pet",
    description: "Edit your pet's profile on SNIF.",
  },
};

export default function Page() {
  return <EditPetPage />;
}
