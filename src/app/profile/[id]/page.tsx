import type { Metadata } from "next";
import ProfilePage from "./ProfileContent";

export const metadata: Metadata = {
  title: "Profile",
  description: "View pet owner profile on SNIF.",
  openGraph: {
    title: "Profile",
    description: "View pet owner profile on SNIF.",
  },
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ProfilePage params={params} />;
}
