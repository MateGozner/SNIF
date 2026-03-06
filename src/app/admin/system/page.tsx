import type { Metadata } from "next";
import SystemPage from "./SystemContent";

export const metadata: Metadata = {
  title: "System Health | SNIF Admin",
  description: "Monitor SNIF system health and status.",
  openGraph: {
    title: "System Health | SNIF Admin",
    description: "Monitor SNIF system health and status.",
  },
};

export default function Page() {
  return <SystemPage />;
}
