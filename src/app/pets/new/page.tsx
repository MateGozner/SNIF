import type { Metadata } from "next";
import NewPetPage from "./NewPetContent";

export const metadata: Metadata = {
  title: "Add Pet",
  description: "Add a new pet to your SNIF profile.",
  openGraph: {
    title: "Add Pet",
    description: "Add a new pet to your SNIF profile.",
  },
};

export default function Page() {
  return <NewPetPage />;
}
