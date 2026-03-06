import type { Metadata } from "next";
import SubscriptionsPage from "./SubscriptionsContent";

export const metadata: Metadata = {
  title: "Subscriptions | SNIF Admin",
  description: "Manage SNIF subscription plans and billing.",
  openGraph: {
    title: "Subscriptions | SNIF Admin",
    description: "Manage SNIF subscription plans and billing.",
  },
};

export default function Page() {
  return <SubscriptionsPage />;
}
