import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SNIF Privacy Policy — how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: March 6, 2026</p>

      <p>
        SNIF (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the SNIF mobile application and website
        (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard
        your information when you use our Service.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>1.1 Personal Information</h3>
      <ul>
        <li><strong>Account data:</strong> name, email address, password (hashed), profile picture</li>
        <li><strong>Pet profiles:</strong> pet name, breed, species, age, gender, photos, medical history, personality traits</li>
        <li><strong>Location data:</strong> approximate location for finding nearby pet matches</li>
        <li><strong>Communication data:</strong> messages sent through the chat feature</li>
        <li><strong>Match &amp; swipe data:</strong> your match preferences and swipe history</li>
      </ul>

      <h3>1.2 Automatically Collected Information</h3>
      <ul>
        <li>Device information (type, OS, browser)</li>
        <li>Usage analytics (pages viewed, features used, session duration)</li>
        <li>IP address</li>
        <li>Crash reports and performance data</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li><strong>Pet matching:</strong> to connect you with compatible pet owners nearby</li>
        <li><strong>Communication:</strong> to enable messaging between matched users</li>
        <li><strong>Account management:</strong> to create and maintain your account</li>
        <li><strong>Analytics:</strong> to improve our Service through aggregated usage data</li>
        <li><strong>Safety:</strong> to detect and prevent fraud, abuse, and violations of our Terms</li>
        <li><strong>Payments:</strong> to process subscription payments through Stripe</li>
      </ul>

      <h2>3. Legal Basis for Processing (GDPR Article 6)</h2>
      <ul>
        <li><strong>Consent:</strong> you provide explicit consent when creating an account and using optional features</li>
        <li><strong>Contract:</strong> processing necessary to provide the Service as agreed in our Terms</li>
        <li><strong>Legitimate interest:</strong> analytics, security, and Service improvement</li>
        <li><strong>Legal obligation:</strong> compliance with applicable laws and regulations</li>
      </ul>

      <h2>4. Data Retention</h2>
      <p>
        We retain your personal data for as long as your account is active. When you delete your account:
      </p>
      <ul>
        <li>Personal data (name, email, profile picture) is immediately anonymized</li>
        <li>Anonymized match and interaction records are retained for other users&apos; continuity</li>
        <li>Payment records are retained as required by tax law (typically 7 years)</li>
        <li>You may request a full data export before deleting your account</li>
      </ul>

      <h2>5. Third-Party Services</h2>
      <p>We share data with the following third-party processors:</p>
      <ul>
        <li><strong>Stripe</strong> — payment processing (PCI DSS compliant)</li>
        <li><strong>Firebase</strong> — authentication and push notifications</li>
        <li><strong>Microsoft Azure</strong> — cloud hosting and storage (EU data centers)</li>
        <li><strong>Google</strong> — OAuth sign-in (when you choose Google login)</li>
      </ul>
      <p>
        We do not sell your personal data to any third party. We do not use your data for
        marketing purposes beyond our own Service.
      </p>

      <h2>6. Your Rights (GDPR)</h2>
      <p>Under the General Data Protection Regulation, you have the right to:</p>
      <ul>
        <li><strong>Access:</strong> request a copy of all data we hold about you (Settings → Export Data)</li>
        <li><strong>Rectification:</strong> correct inaccurate personal data via your profile settings</li>
        <li><strong>Erasure:</strong> delete your account and personal data (Settings → Delete Account)</li>
        <li><strong>Portability:</strong> receive your data in a structured, machine-readable format (JSON export)</li>
        <li><strong>Restriction:</strong> request restriction of processing in certain circumstances</li>
        <li><strong>Objection:</strong> object to processing based on legitimate interest</li>
        <li><strong>Withdraw consent:</strong> withdraw consent at any time without affecting prior lawful processing</li>
      </ul>
      <p>
        To exercise these rights, use the in-app settings or contact us at{" "}
        <a href="mailto:privacy@snif.app">privacy@snif.app</a>.
      </p>

      <h2>7. Cookie Policy</h2>
      <p>We use the following types of cookies:</p>
      <ul>
        <li><strong>Essential cookies:</strong> authentication token and session management (required for the Service to function)</li>
        <li><strong>Analytics cookies:</strong> Application Insights for performance monitoring (optional, controlled via cookie consent)</li>
      </ul>
      <p>
        We do not use marketing or advertising cookies. You can manage your cookie preferences at
        any time through the cookie consent banner.
      </p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        The Service is not intended for children under 18. We do not knowingly collect personal data
        from anyone under 18. If you are a parent or guardian and believe your child has provided us
        with personal data, please contact us so we can delete it.
      </p>

      <h2>9. International Data Transfers</h2>
      <p>
        Your data may be transferred to and processed in countries outside the European Economic Area (EEA).
        When this occurs, we ensure appropriate safeguards are in place, including:
      </p>
      <ul>
        <li>EU-approved Standard Contractual Clauses (SCCs)</li>
        <li>Adequacy decisions by the European Commission</li>
        <li>Data Processing Agreements with all third-party processors</li>
      </ul>

      <h2>10. Data Security</h2>
      <p>
        We implement industry-standard security measures including encryption in transit (TLS 1.3),
        encryption at rest, secure password hashing, rate limiting, and regular security audits.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of significant changes
        through in-app notifications or email. Continued use of the Service constitutes acceptance of
        the updated policy.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        For privacy-related inquiries or to exercise your rights:
      </p>
      <ul>
        <li>Email: <a href="mailto:privacy@snif.app">privacy@snif.app</a></li>
        <li>Data Protection Officer: <a href="mailto:dpo@snif.app">dpo@snif.app</a></li>
      </ul>
    </main>
  );
}
