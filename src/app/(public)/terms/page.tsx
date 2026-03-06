import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SNIF Terms of Service — rules and conditions for using the platform.",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated: March 6, 2026</p>

      <p>
        Welcome to SNIF (&quot;Social Networking In Fur&quot;). By accessing or using our Service, you agree
        to be bound by these Terms. If you do not agree, please do not use the Service.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years old to create an account and use the Service. By registering,
        you represent and warrant that you meet this age requirement.
      </p>

      <h2>2. Your Account</h2>
      <ul>
        <li>You are responsible for maintaining the security of your account credentials.</li>
        <li>You agree to provide accurate and truthful information in your profile and pet listings.</li>
        <li>You may not create accounts on behalf of others without their consent.</li>
        <li>You may not use the Service for any unlawful purpose.</li>
      </ul>

      <h2>3. Acceptable Use</h2>
      <p>When using SNIF, you agree not to:</p>
      <ul>
        <li>Post false, misleading, or fraudulent pet listings</li>
        <li>Harass, threaten, or abuse other users</li>
        <li>Upload content that is illegal, harmful, or violates the rights of others</li>
        <li>Attempt to gain unauthorized access to accounts or systems</li>
        <li>Use the platform for commercial breeding operations without breeder verification</li>
        <li>Circumvent any safety or security features</li>
        <li>Scrape, crawl, or otherwise extract data from the Service</li>
      </ul>

      <h2>4. Pet Listings &amp; Matches</h2>
      <ul>
        <li>You are solely responsible for the accuracy of your pet profiles.</li>
        <li>Medical history provided must be truthful to the best of your knowledge.</li>
        <li>Matches facilitated by SNIF are introductions only; we are not responsible for
          the outcome of any pet interaction, playdate, or breeding arrangement.</li>
        <li>You are responsible for ensuring the safety and welfare of your pets during
          any meeting arranged through the Service.</li>
      </ul>

      <h2>5. Subscriptions &amp; Payments</h2>
      <ul>
        <li>Some features require a paid subscription.</li>
        <li>Payments are processed securely through Stripe.</li>
        <li>Subscriptions auto-renew unless canceled before the renewal date.</li>
        <li>Refunds are handled in accordance with applicable consumer protection laws.</li>
        <li>We reserve the right to change pricing with 30 days&apos; notice.</li>
      </ul>

      <h2>6. Content &amp; Intellectual Property</h2>
      <ul>
        <li>You retain ownership of content (photos, text) you upload to SNIF.</li>
        <li>By uploading content, you grant us a non-exclusive, worldwide license to use,
          display, and distribute it within the Service.</li>
        <li>You must have the right to share any content you upload.</li>
        <li>We may remove content that violates these Terms or applicable law.</li>
      </ul>

      <h2>7. Privacy</h2>
      <p>
        Your use of the Service is also governed by our{" "}
        <a href="/privacy">Privacy Policy</a>, which explains how we collect, use,
        and protect your personal information.
      </p>

      <h2>8. Moderation &amp; Enforcement</h2>
      <p>We reserve the right to:</p>
      <ul>
        <li>Issue warnings for policy violations</li>
        <li>Temporarily suspend accounts</li>
        <li>Permanently ban accounts for serious or repeated violations</li>
        <li>Remove content that violates these Terms</li>
        <li>Report illegal activity to law enforcement</li>
      </ul>

      <h2>9. Limitation of Liability</h2>
      <p>
        SNIF is provided &quot;as is&quot; without warranties of any kind. To the maximum extent permitted
        by law, we are not liable for any damages arising from your use of the Service, including
        but not limited to injuries to persons or pets resulting from meetings arranged through
        the platform.
      </p>

      <h2>10. Termination</h2>
      <p>
        You may delete your account at any time through Settings. We may terminate or suspend
        your account if you violate these Terms. Upon termination, your personal data will be
        handled in accordance with our Privacy Policy.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the European Union and the applicable laws of
        the member state in which we are established. Any disputes shall be resolved through
        the courts of competent jurisdiction.
      </p>

      <h2>12. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. We will notify you of material changes
        through in-app notifications or email. Continued use of the Service after changes
        constitutes acceptance.
      </p>

      <h2>13. Contact</h2>
      <p>
        For questions about these Terms, contact us at{" "}
        <a href="mailto:support@snif.app">support@snif.app</a>.
      </p>
    </main>
  );
}
