import type { Metadata } from "next";
import AdminUsersPage from "./UsersContent";

export const metadata: Metadata = {
  title: "Users | SNIF Admin",
  description: "Manage users on the SNIF platform.",
  openGraph: {
    title: "Users | SNIF Admin",
    description: "Manage users on the SNIF platform.",
  },
};

export default function Page() {
  return <AdminUsersPage />;
}
