import React from "react";
import { Link } from "react-router-dom";
import LegalLayout from "../components/legal/LegalLayout";
import { ExternalLink, ArrowRight } from "lucide-react";

export default function TermsPage() {
  const tocItems = [
    { id: "acceptance-of-terms", label: "1. Acceptance of Terms" },
    { id: "about-ados", label: "2. About ADOS" },
    { id: "user-accounts", label: "3. User Accounts" },
    { id: "third-party-accounts", label: "4. Third-Party Advertising Accounts" },
    { id: "advertising-campaigns", label: "5. Advertising Campaigns" },
    { id: "payments-balance", label: "6. Payments and Platform Balance" },
    { id: "prohibited-activities", label: "7. Prohibited Activities" },
    { id: "third-party-services", label: "8. Third-Party Services" },
    { id: "intellectual-property", label: "9. Intellectual Property" },
    { id: "suspension-termination", label: "10. Suspension and Termination" },
    { id: "limitation-of-liability", label: "11. Limitation of Liability" },
    { id: "changes-to-terms", label: "12. Changes to Terms" },
    { id: "governing-law", label: "13. Governing Law" },
    { id: "contact", label: "14. Contact" },
  ];

  return (
    <LegalLayout
      title="ADOS Terms of Service"
      subtitle="These Terms of Service govern your access to and use of ADOS, an advertising management platform designed to help businesses connect, monitor and manage supported digital advertising accounts."
      category="TERMS OF SERVICE & USER AGREEMENT"
      effectiveDate="November 7, 2026"
      tocItems={tocItems}
    >
      {/* High-End Editorial Key Provisions Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Executive Summary
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
              Platform Usage & Legal Framework
            </h2>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded">
            Binding Agreement
          </span>
        </div>

        <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed pt-5 pb-6">
          By accessing or utilizing ADOS, you agree to comply with these Terms of Service. You retain full intellectual property ownership of your advertising materials, operate under the requirement of legal account authorization, and acknowledge the performance boundaries of third-party advertising APIs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Provision 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                PROVISION 01
              </span>
              <span className="text-[10px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded font-medium">
                Authorization
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Authorized Connections
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Users must possess verified administrative authority over all advertising accounts connected to the ADOS platform.
            </p>
          </div>

          {/* Provision 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                PROVISION 02
              </span>
              <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                Ad Disclaimer
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              No Guaranteed Results
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Campaign reach, conversions, and delivery costs depend strictly on external ad networks, competition, and user assets.
            </p>
          </div>

          {/* Provision 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                PROVISION 03
              </span>
              <span className="text-[10px] font-mono text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                Jurisdiction
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Governing Law
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All terms, service relationships, and disputes are subject to the applicable laws and competent courts of India.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Acceptance of Terms */}
      <section id="acceptance-of-terms" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">01</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Acceptance of Terms
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Binding Agreement
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            By accessing or using ADOS, you agree to these Terms of Service.
          </p>
          <p>
            If you do not agree with these terms, you should not use the platform.
          </p>
        </div>
      </section>

      {/* 2. About ADOS */}
      <section id="about-ados" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">02</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              About ADOS
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Service Description
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS is an advertising management platform designed to help businesses connect, monitor and manage supported digital advertising accounts through a centralized interface.
          </p>
          <p>
            Available features may include advertising analytics, campaign management, creative generation and advertising performance monitoring.
          </p>
        </div>
      </section>

      {/* 3. User Accounts */}
      <section id="user-accounts" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">03</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              User Accounts
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            User Obligations
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>Users must:</p>
          <ul className="space-y-2 pl-3 text-sm text-slate-800">
            {[
              "Provide accurate registration information.",
              "Keep their login credentials secure.",
              "Be responsible for activity under their accounts.",
              "Notify ADOS of unauthorized account access.",
              "Use the platform only for lawful purposes.",
            ].map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Third-Party Advertising Accounts */}
      <section id="third-party-accounts" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">04</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Third-Party Advertising Accounts
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            API Permissions
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS may support connections to Google Ads, Facebook Ads, Instagram Ads and other advertising platforms.
          </p>
          <p>By connecting an account, you confirm that:</p>
          <ul className="space-y-2 pl-3 text-sm text-slate-800">
            {[
              "You have the authority to connect that account.",
              "You authorize the requested access.",
              "You comply with the advertising platform's applicable terms and policies.",
            ].map((auth, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>{auth}</span>
              </li>
            ))}
          </ul>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            ADOS is not affiliated with or endorsed by Google, Meta or LinkedIn unless explicitly stated.
          </div>
        </div>
      </section>

      {/* 5. Advertising Campaigns */}
      <section id="advertising-campaigns" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">05</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Advertising Campaigns
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Execution & Liability
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>Users are responsible for:</p>
          <ul className="space-y-2 pl-3 text-sm text-slate-800">
            {[
              "Reviewing advertising content before publication.",
              "Selecting appropriate audiences and budgets.",
              "Ensuring advertising claims are accurate.",
              "Following applicable advertising laws and platform policies.",
              "Monitoring campaign spending and performance.",
            ].map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
          <p>
            Where campaign execution features are available, users must provide the required authorization before advertising actions are performed.
          </p>
          <div className="p-4 rounded-lg bg-slate-50 border-l-2 border-slate-900 text-sm text-slate-900 leading-relaxed">
            <strong>Disclaimer of Results:</strong> ADOS does not guarantee advertising results, sales, leads, impressions or conversions. Campaign outcomes depend entirely on external network delivery algorithms, bidding markets, audience resonance, and advertiser creatives.
          </div>
        </div>
      </section>

      {/* 6. Payments and Platform Balance */}
      <section id="payments-balance" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">06</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Payments and Platform Balance
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Billing
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>Where payment and platform balance features are available:</p>
          <ul className="space-y-2 pl-3 text-sm text-slate-800">
            {[
              "Users must provide accurate payment information.",
              "Payments may be processed through third-party payment providers.",
              "Advertising budgets and platform service charges may be displayed separately.",
              "Applicable refund and cancellation conditions will be disclosed before payment.",
              "Users are responsible for reviewing campaign budgets before authorizing advertising expenditure.",
            ].map((pay, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>{pay}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Prohibited Activities */}
      <section id="prohibited-activities" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">07</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Prohibited Activities
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Platform Restrictions
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>Users must not:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-900">
            {[
              "Use ADOS for fraudulent or illegal advertising.",
              "Promote prohibited products or services.",
              "Violate third-party intellectual property rights.",
              "Attempt unauthorized access to accounts or systems.",
              "Abuse advertising APIs or platform integrations.",
              "Distribute malicious or misleading content.",
            ].map((prohib, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 flex-shrink-0" />
                <span>{prohib}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Third-Party Services */}
      <section id="third-party-services" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">08</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Third-Party Services
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Dependencies
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS depends on third-party services and APIs for certain features.
          </p>
          <p>
            We are not responsible for outages, policy changes, account restrictions or service interruptions caused by external platforms.
          </p>
        </div>
      </section>

      {/* 9. Intellectual Property */}
      <section id="intellectual-property" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">09</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Intellectual Property
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Ownership Rights
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS branding, website design, software and original platform materials are protected by applicable intellectual property laws.
          </p>
          <p>
            Users retain ownership of content they provide, subject to the permissions necessary to operate the services.
          </p>
        </div>
      </section>

      {/* 10. Suspension and Termination */}
      <section id="suspension-termination" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">10</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Suspension and Termination
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Remedies
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS may restrict or suspend accounts involved in unlawful activities, security violations or breaches of these terms.
          </p>
          <p>
            Users may request account closure and data deletion.
          </p>
        </div>
      </section>

      {/* 11. Limitation of Liability */}
      <section id="limitation-of-liability" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">11</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Limitation of Liability
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Legal Boundaries
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            To the extent permitted by applicable law, ADOS is not responsible for indirect losses, advertising platform decisions, campaign performance or third-party service interruptions.
          </p>
          <p>
            Nothing in these terms excludes liability that cannot legally be excluded.
          </p>
        </div>
      </section>

      {/* 12. Changes to Terms */}
      <section id="changes-to-terms" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">12</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Changes to Terms
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Modifications
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            We may update these Terms of Service as our platform evolves.
          </p>
          <p>
            Continued use after updated terms are published constitutes acceptance where permitted by applicable law.
          </p>
        </div>
      </section>

      {/* 13. Governing Law */}
      <section id="governing-law" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">13</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Governing Law
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Jurisdiction
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            These terms are subject to applicable laws of India, with jurisdiction to be determined by the competent courts in the appropriate jurisdiction.
          </p>
        </div>
      </section>

      {/* 14. Contact */}
      <section id="contact" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">14</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Contact
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Inquiries
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>For questions regarding these terms:</p>
          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-sm">
            <div className="font-bold text-slate-950">ADOS</div>
            <div>
              <span className="text-slate-400 font-mono text-xs">Email: </span>
              <a
                href="mailto:idrtech23@gmail.com"
                className="font-semibold text-slate-900 hover:underline"
              >
                idrtech23@gmail.com
              </a>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-xs">Website: </span>
              <a
                href="https://idrtech.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-900 hover:underline"
              >
                https://idrtech.in
              </a>
            </div>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
