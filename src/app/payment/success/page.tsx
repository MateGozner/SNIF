import type { Metadata } from "next";
import PaymentSuccessPage from "./SuccessContent";

export const metadata: Metadata = {
  title: "Payment Success",
  description: "Your SNIF subscription payment was successful.",
  openGraph: {
    title: "Payment Success",
    description: "Your SNIF subscription payment was successful.",
  },
};

export default function Page() {
  return <PaymentSuccessPage />;
}
