import type { Metadata } from "next";
import LoginPage from "./LoginContent";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your SNIF account.",
  openGraph: {
    title: "Login",
    description: "Sign in to your SNIF account.",
  },
};

export default function Page() {
  return <LoginPage />;
}
