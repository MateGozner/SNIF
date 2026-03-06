import type { Metadata } from "next";
import ForgotPasswordContent from "./ForgotPasswordContent";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your SNIF account password.",
  openGraph: {
    title: "Forgot Password",
    description: "Reset your SNIF account password.",
  },
};

export default function Page() {
  return <ForgotPasswordContent />;
}
