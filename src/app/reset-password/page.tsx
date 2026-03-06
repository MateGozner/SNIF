import type { Metadata } from "next";
import ResetPasswordContent from "./ResetPasswordContent";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your SNIF account.",
  openGraph: {
    title: "Reset Password",
    description: "Set a new password for your SNIF account.",
  },
};

export default function Page() {
  return <ResetPasswordContent />;
}
