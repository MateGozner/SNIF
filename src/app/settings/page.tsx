import type { Metadata } from "next";
import SettingsPage from "./SettingsContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your SNIF account settings.",
  openGraph: {
    title: "Settings",
    description: "Manage your SNIF account settings.",
  },
};

export default function Page() {
  return <SettingsPage />;
}
