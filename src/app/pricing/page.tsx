import type { Metadata } from "next";
import { PricingPage } from "@/components/subscription/PricingPage";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the perfect SNIF plan for you and your pets.",
  openGraph: {
    title: "Pricing",
    description: "Choose the perfect SNIF plan for you and your pets.",
  },
};

export default function PricingRoute() {
  return <PricingPage />;
}
