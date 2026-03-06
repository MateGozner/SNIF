import type { Metadata } from "next";
import PaymentCancelPage from "./CancelContent";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your payment was cancelled. No charges were made.",
  openGraph: {
    title: "Payment Cancelled",
    description: "Your payment was cancelled. No charges were made.",
  },
};

export default function Page() {
  return <PaymentCancelPage />;
}
