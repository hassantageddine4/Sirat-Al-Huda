// src/pages/legal/TermsOfService.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Terms of Service.
//
// Sirat uses Apple's standard End User License Agreement (EULA) for all
// licensed application end users. This file delegates entirely to Apple's
// public EULA — no custom Sirat terms beyond what Apple provides.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  LegalDocLayout, Section, ExternalLink,
} from "../../components/legal/LegalDocLayout";

const APPLE_EULA = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";
const LAST_UPDATED = "May 2, 2026";

export default function TermsOfService() {
  return (
    <LegalDocLayout title="Terms of Service" lastUpdated={LAST_UPDATED}>

      <p className="text-[14px] text-body leading-relaxed mb-6">
        Your use of Sirat Al Huda is governed by Apple's standard
        Licensed Application End User License Agreement (EULA), which all
        applications distributed through the App Store are subject to.
      </p>

      <Section title="Apple End User License Agreement">
        <p>
          Sirat is a "Licensed Application" as defined in Apple's standard
          EULA. By using Sirat, you agree to the terms of that agreement,
          which Apple provides to all App Store users.
        </p>
        <p>
          You can read the full agreement here:
        </p>
        <p>
          <ExternalLink href={APPLE_EULA}>{APPLE_EULA}</ExternalLink>
        </p>
      </Section>

    </LegalDocLayout>
  );
}
