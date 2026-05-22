// src/components/legal/AuthLegalFooter.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Footer for the SignIn and SignUp screens. Follows iOS / App Store
// convention: small, centered, non-intrusive — visible but not loud.
//
// Drop into the bottom of your auth pages above the safe-area inset:
//
//   import AuthLegalFooter from "../components/legal/AuthLegalFooter";
//   ...
//   <AuthLegalFooter context="signup" />   // or "signin"
//
// On signup, includes the standard "By creating an account you agree to..."
// affirmation that App Store reviewers expect to see for apps with accounts.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthLegalFooter({ context = "signin", className = "" }) {
  const navigate = useNavigate();

  return (
    <footer
      className={`px-6 pt-6 pb-4 ${className}`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>

      {context === "signup" && (
        <p className="text-center text-[11px] text-muted leading-relaxed mb-2">
          By creating an account, you agree to Sirat's{" "}
          <FooterLink onClick={() => navigate("/legal/terms")}>
            Terms of Service
          </FooterLink>
          {" "}and{" "}
          <FooterLink onClick={() => navigate("/legal/privacy")}>
            Privacy Policy
          </FooterLink>
          .
        </p>
      )}

      {context === "signin" && (
        <div className="flex items-center justify-center gap-3 text-[11px] text-muted">
          <FooterLink onClick={() => navigate("/legal/terms")}>
            Terms
          </FooterLink>
          <span aria-hidden="true" className="w-0.5 h-0.5 rounded-full bg-muted/40" />
          <FooterLink onClick={() => navigate("/legal/privacy")}>
            Privacy
          </FooterLink>
        </div>
      )}
    </footer>
  );
}

function FooterLink({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="press underline decoration-muted/40 underline-offset-2 hover:decoration-accent hover:text-accent-dark transition-colors font-semibold">
      {children}
    </button>
  );
}
