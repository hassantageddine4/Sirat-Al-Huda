// src/pages/legal/TermsOfService.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Terms of Service.
//
// IMPORTANT: This is a starter template that covers the App Store requirements
// (Apple EULA reference, content sourcing, community guidelines, etc.).
// Before submitting to the App Store, have a lawyer review or use a service
// like Termly / iubenda to generate a fully compliant version specific to
// your jurisdiction(s) of operation.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  LegalDocLayout, Section, Subsection, Bullets, ExternalLink,
} from "../../components/legal/LegalDocLayout";

const APPLE_EULA = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";
const SUPPORT_EMAIL = "support@sirat.app";
const LAST_UPDATED = "April 26, 2026";

export default function TermsOfService() {
  return (
    <LegalDocLayout title="Terms of Service" lastUpdated={LAST_UPDATED}>

      <p className="text-[14px] text-body leading-relaxed mb-6">
        Welcome to Sirat Al Huda ("Sirat", "the app", "we", "us"). These Terms
        of Service ("Terms") govern your use of the Sirat mobile application.
        By creating an account or otherwise using Sirat, you agree to these Terms.
        If you do not agree, please do not use the app.
      </p>

      <Section title="1. About Sirat">
        <p>
          Sirat is a daily Muslim practice companion that provides prayer times,
          a Qur'an reader with translations, hadith collections, a personal
          journal, a daily routine tracker, and supplementary tools. The app is
          provided for educational, religious, and personal practice purposes.
        </p>
        <p>
          Sirat is intended as a supplement to your religious practice, not a
          substitute for guidance from qualified scholars or community leaders.
          Religious rulings (fatawa) and detailed jurisprudential matters should
          always be referred to a qualified scholar.
        </p>
      </Section>

      <Section title="2. Eligibility & accounts">
        <Subsection title="Account creation">
          <p>
            You may create an account using an email address or supported
            third-party sign-in. You are responsible for keeping your login
            credentials secure and for any activity under your account.
          </p>
        </Subsection>
        <Subsection title="Age">
          <p>
            Sirat is suitable for users of all ages, but children under 13
            should use Sirat only with parental consent and supervision. If you
            believe a child has registered an account without consent, please
            contact{" "}
            <ExternalLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</ExternalLink>.
          </p>
        </Subsection>
      </Section>

      <Section title="3. Religious content & sources">
        <p>
          Sirat displays Qur'anic text, translations, and hadith from
          third-party sources. We do our best to use trusted, widely-accepted
          translations and authentic hadith collections, but we cannot guarantee
          complete accuracy of every word. We are grateful to the maintainers
          of the following projects for making this content available:
        </p>
        <Bullets items={[
          "Qur'an text and translations: Quran.com API (api.quran.com), used in accordance with their terms.",
          "Hadith collections: fawazahmed0/hadith-api on GitHub, an open dataset of major hadith books.",
          "Hijri calendar: AlAdhan API for Gregorian / Hijri date conversion and Islamic holidays.",
          "Recitations: Various reciters provided through Quran.com's audio API.",
        ]} />
        <p>
          Where you notice an error in a translation, hadith grading, or other
          content, please report it via{" "}
          <ExternalLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</ExternalLink>{" "}
          so we can investigate and forward to the appropriate source.
        </p>
      </Section>

      <Section title="4. Acceptable use">
        <p>You agree not to:</p>
        <Bullets items={[
          "Use Sirat to harass, threaten, or defame any person, group, or community.",
          "Misrepresent religious content, fabricate hadith, or distort translations.",
          "Engage in sectarian incitement against any school of thought or denomination.",
          "Upload content that is unlawful, hateful, sexually explicit, or that infringes on others' intellectual property.",
          "Attempt to reverse-engineer, scrape, or interfere with the app's normal operation.",
          "Use the app to send unsolicited communications to other users.",
        ]} />
      </Section>

      <Section title="5. Community guidelines">
        <p>
          Sirat may include community features (journal sharing, comments,
          reactions) in current or future versions. When using these:
        </p>
        <Bullets items={[
          "Maintain the adab (etiquette) befitting a Muslim community: respect, kindness, and lowering the gaze.",
          "Treat all schools of thought (madhahib) and denominations with respect — Sirat is intended to be inclusive.",
          "Do not share other users' personal information without consent.",
          "Report content that violates these Terms using the in-app report option, where available.",
        ]} />
        <p>
          We reserve the right to remove content and suspend accounts that
          violate these guidelines, in line with Apple's App Store Review
          Guidelines section 1.2 on user-generated content.
        </p>
      </Section>

      <Section title="6. Recitation & practice features">
        <p>
          Some Sirat features (such as recitation practice) may use your
          microphone and on-device speech recognition. By using these features,
          you understand that:
        </p>
        <Bullets items={[
          "Audio is processed locally on your device wherever technically possible.",
          "Where speech recognition is provided by Apple or another platform, your audio may be temporarily processed by that platform under its own privacy policy.",
          "Sirat does not record, store, or transmit your recitations to our servers without your explicit action.",
          "Recitation feedback is best-effort and not a substitute for instruction from a qualified teacher (mu'allim).",
        ]} />
      </Section>

      <Section title="7. Subscriptions and purchases">
        <p>
          If Sirat offers paid features or subscriptions, all purchases are
          processed by Apple via the App Store and are governed by Apple's
          terms. Subscriptions auto-renew unless canceled in your Apple ID
          settings at least 24 hours before the end of the current period.
        </p>
      </Section>

      <Section title="8. Intellectual property">
        <p>
          The Sirat app, its design, brand, code, and original content are
          owned by us and protected by applicable copyright and trademark laws.
          Third-party content (Qur'an, hadith, translations, audio) belongs to
          its respective rights holders.
        </p>
      </Section>

      <Section title="9. Disclaimers">
        <p>
          Sirat is provided "as is" without warranties of any kind, express or
          implied. We do not warrant that prayer times, qibla direction, hijri
          dates, or other calculated information are free of error. Always
          verify with local mosque or scholarly resources for matters of
          religious obligation.
        </p>
      </Section>

      <Section title="10. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Sirat and its developers are
          not liable for indirect, incidental, or consequential damages arising
          from your use of the app.
        </p>
      </Section>

      <Section title="11. Changes to these Terms">
        <p>
          We may update these Terms from time to time. Material changes will
          be communicated in-app or by email. Continued use of Sirat after a
          change indicates acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="12. Apple End User Licence Agreement">
        <p>
          As an app distributed through the Apple App Store, Sirat is also
          subject to Apple's standard End User Licence Agreement, which is
          incorporated into these Terms by reference.
        </p>
        <p>
          <ExternalLink href={APPLE_EULA}>
            Read Apple's Standard EULA →
          </ExternalLink>
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          Questions about these Terms? Email{" "}
          <ExternalLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</ExternalLink>.
        </p>
      </Section>

      <p className="text-[12px] text-muted/70 mt-8 mb-4">
        © {new Date().getFullYear()} Sirat Al Huda. All rights reserved.
      </p>
    </LegalDocLayout>
  );
}
