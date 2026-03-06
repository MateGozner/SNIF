export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="max-w-3xl mx-auto flex justify-center gap-6">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="mailto:support@snif.app" className="hover:underline">
            Contact
          </a>
        </div>
        <p className="mt-2">&copy; {new Date().getFullYear()} SNIF. All rights reserved.</p>
      </footer>
    </>
  );
}
