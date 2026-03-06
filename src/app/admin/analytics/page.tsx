import type { Metadata } from "next";
import AnalyticsPage from "./AnalyticsContent";

export const metadata: Metadata = {
  title: "Analytics | SNIF Admin",
  description: "View platform analytics and insights.",
  openGraph: {
    title: "Analytics | SNIF Admin",
    description: "View platform analytics and insights.",
  },
};

export default function Page() {
  return <AnalyticsPage />;
}
