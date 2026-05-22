// src/pages/legal/PrivacyPolicy.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Privacy Policy.
//
// IMPORTANT: This is a starter template that covers the App Store's required
// disclosures and aligns with Apple's privacy nutrition label categories.
// For GDPR / CCPA / regional compliance, have a lawyer review or use a
// service like Termly / iubenda before submission.
//
// Apple requires a publicly-accessible URL to a privacy policy during App
// Store submission — host this content at e.g. https://sirat.app/privacy
// in addition to bundling the in-app screen.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  LegalDocLayout, Section, Subsection, Bullets, ExternalLink,
} from "../../components/legal/LegalDocLayout";

const SUPPORT_EMAIL = "support@sirat.app";
const LAST_UPDATED = "April 26, 2026";

export default function PrivacyPolicy() {
  return (
    <LegalDocLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>

      <p className="text-[14px] text-body leading-relaxed mb-6">
        Sirat Al Huda ("Sirat", "we", "us") respects your privacy. This Policy
        explains what information Sirat collects, how it is used, and the
        choices you have. Sirat is designed to keep most data on your device,
        and to collect only what is genuinely needed for the features you use.
      </p>

      <Section title="At a glance">
        <Bullets items={[
          "Most of your data — prayer history, journal entries, daily routine, bookmarks, reading prefs — stays on your device.",
          "Account information (email, sign-in metadata) is stored by our authentication provider, Supabase.",
          "Sirat never sells your data, ever.",
          "Sirat shows no advertising and uses no third-party analytics SDKs that profile you.",
        ]} />
      </Section>

      <Section title="1. Information we collect">

        <Subsection title="Account information">
          <p>
            When you create an account, we collect your email address and an
            authentication identifier provided by Supabase, our authentication
            backend. If you sign in with Apple or Google, we receive only the
            information those providers share at sign-in (typically an email
            and a unique account ID).
          </p>
        </Subsection>

        <Subsection title="On-device data">
          <p>
            The following information is stored locally on your device using
            iOS storage and is not transmitted to our servers:
          </p>
          <Bullets items={[
            "Daily prayer completion checks",
            "Daily routine entries and streaks",
            "Personal journal entries",
            "Bookmarked hadiths and verses",
            "Reading preferences (font size, translation choice, reciter)",
            "Cached Qur'an, hadith, and Hijri-calendar content for offline use",
          ]} />
        </Subsection>

        <Subsection title="Information we do not collect">
          <Bullets items={[
            "We do not collect your precise location. The qibla and prayer-time features compute results on-device using a coarse location, which is not stored on our servers.",
            "We do not record audio. The recitation feature processes voice on-device via iOS speech recognition; nothing is uploaded to Sirat servers.",
            "We do not use third-party advertising SDKs.",
            "We do not maintain behavioral profiles of users for marketing.",
          ]} />
        </Subsection>
      </Section>

      <Section title="2. Permissions we request">
        <p>
          iOS asks your permission before any of the following are accessed.
          You can grant or deny each permission independently and revoke them
          at any time in <strong>iOS Settings → Sirat</strong>.
        </p>

        <Subsection title="Location (when in use)">
          <p>
            Used to compute accurate prayer times and qibla direction for
            where you are. Location is used in-memory during the calculation
            and is not transmitted to or stored on our servers.
          </p>
        </Subsection>

        <Subsection title="Notifications">
          <p>
            Used to remind you of upcoming prayer times. Reminders are
            scheduled <em>locally</em> on your device. We do not push
            notifications from our servers, and reminder content does not
            leave your device.
          </p>
        </Subsection>

        <Subsection title="Microphone">
          <p>
            Used by the recitation practice feature so you can compare your
            recitation to the Qur'anic text. Audio is processed by iOS and
            does not leave your device.
          </p>
        </Subsection>

        <Subsection title="Speech recognition">
          <p>
            On iOS, speech recognition is provided by Apple. Apple may
            temporarily process audio under{" "}
            <ExternalLink href="https://www.apple.com/legal/privacy/">
              Apple's Privacy Policy
            </ExternalLink>
            . Sirat does not store transcripts.
          </p>
        </Subsection>
      </Section>

      <Section title="3. How we use information">
        <p>We use the limited data described above to:</p>
        <Bullets items={[
          "Provide app features (prayer times, qibla, journal, bookmarks).",
          "Authenticate you and keep your account secure.",
          "Sync your account-level preferences across devices, where applicable.",
          "Diagnose technical issues and crashes.",
          "Communicate with you about your account or app updates, when relevant.",
        ]} />
      </Section>

      <Section title="4. Data retention">
        <p>
          Account data is retained while your account is active. If you delete
          your account, we delete your account record and associated personal
          data within 30 days. On-device data remains under your control —
          uninstalling Sirat removes it entirely.
        </p>
      </Section>

      <Section title="5. Your rights">
        <p>Depending on where you live, you may have the right to:</p>
        <Bullets items={[
          "Access the personal data we hold about you.",
          "Correct inaccurate data.",
          "Request deletion of your account and associated data.",
          "Export your data in a portable format.",
          "Object to or restrict certain processing.",
          "Withdraw consent where consent is the basis for processing.",
        ]} />
        <p>
          To exercise these rights, email{" "}
          <ExternalLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</ExternalLink>.
          We will respond within the timeframe required by applicable law.
        </p>
      </Section>

      <Section title="6. Children">
        <p>
          Sirat is suitable for users of all ages, but we do not knowingly
          collect personal information from children under 13 without parental
          consent. If you believe we have done so, please contact us and we
          will delete the relevant data.
        </p>
      </Section>

      <Section title="7. Security">
        <p>
          We use industry-standard measures to protect data in transit (TLS)
          and at rest. No system is perfectly secure, but we work to keep
          data safe and to disclose breaches that affect you in a timely
          manner.
        </p>
      </Section>

      <Section title="8. International transfers">
        <p>
          Our service providers may process data in countries other than your
          own. Where required by law, we rely on appropriate safeguards
          (such as standard contractual clauses) for international transfers.
        </p>
      </Section>

      <Section title="9. Changes to this Policy">
        <p>
          We may update this Policy from time to time. Material changes will
          be communicated in-app or by email at least 14 days before they
          take effect.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions, requests, or concerns? Email{" "}
          <ExternalLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</ExternalLink>.
        </p>
      </Section>

      <p className="text-[12px] text-muted/70 mt-8 mb-4">
        © {new Date().getFullYear()} Sirat Al Huda. Effective {LAST_UPDATED}.
      </p>
    </LegalDocLayout>
  );
}
