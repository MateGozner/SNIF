import type { Metadata } from "next";
import ConfirmEmailContent from "./ConfirmEmailContent";

export const metadata: Metadata = {
  title: "Confirm Email",
  description: "Confirm your SNIF account email address.",
  openGraph: {
    title: "Confirm Email",
    description: "Confirm your SNIF account email address.",
  },
};

export default function Page() {
  return <ConfirmEmailContent />;
}
