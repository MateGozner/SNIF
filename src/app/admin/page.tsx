import type { Metadata } from "next";
import AdminDashboardPage from "./AdminDashboardContent";

export const metadata: Metadata = {
  title: "Admin Dashboard | SNIF",
  description: "SNIF administration dashboard.",
  openGraph: {
    title: "Admin Dashboard | SNIF",
    description: "SNIF administration dashboard.",
  },
};

export default function Page() {
  return <AdminDashboardPage />;
}
