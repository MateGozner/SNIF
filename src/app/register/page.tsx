import type { Metadata } from "next";
import RegisterPage from "./RegisterContent";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your SNIF account and connect your pets.",
  openGraph: {
    title: "Register",
    description: "Create your SNIF account and connect your pets.",
  },
};

export default function Page() {
  return <RegisterPage />;
}
