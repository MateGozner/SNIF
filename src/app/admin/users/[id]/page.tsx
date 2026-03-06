import type { Metadata } from "next";
import AdminUserDetailPage from "./UserDetailContent";

export const metadata: Metadata = {
  title: "User Details | SNIF Admin",
  description: "View user details and manage account status.",
  openGraph: {
    title: "User Details | SNIF Admin",
    description: "View user details and manage account status.",
  },
};

export default function Page() {
  return <AdminUserDetailPage />;
}
