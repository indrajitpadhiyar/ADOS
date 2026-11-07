import React from "react";
import { Link } from "react-router-dom";
import LegalLayout from "../components/legal/LegalLayout";
import {
  ExternalLink,
  Mail,
  ArrowRight,
  ShieldCheck,
  Lock,
  Trash2,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const tocItems = [
    { id: "introduction", label: "1. Introduction" },
    { id: "information-we-collect", label: "2. Information We Collect" },
    { id: "third-party-connections", label: "3. Third-Party Platform Connections" },
    { id: "how-we-use-information", label: "4. How We Use Your Information" },
    { id: "data-sharing", label: "5. Data Sharing" },
    { id: "data-security", label: "6. Data Security" },
    { id: "data-retention", label: "7. Data Retention" },
    { id: "account-data-deletion", label: "8. Account and Data Deletion" },
    { id: "third-party-services", label: "9. Third-Party Services" },
    { id: "childrens-privacy", label: "10. Children's Privacy" },
    { id: "changes-to-policy", label: "11. Changes to This Policy" },
    { id: "contact-us", label: "12. Contact Us" },
  ];

  return (
    <LegalLayout
      title="ADOS Privacy Policy"
      subtitle="This Privacy Policy explains how ADOS collects, uses, stores, and protects personal information when you use our advertising management services and centralized dashboard."
      category="PRIVACY POLICY & DATA GOVERNANCE"
      effectiveDate="November 7, 2026"
      tocItems={tocItems}
    >
      {/* High-End Editorial Key Provisions Grid (Clean Swiss Design) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Executive Summary
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
              Core Commitments & Data Governance
            </h2>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded">
            Enterprise Standard
          </span>
        </div>

        <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed pt-5 pb-6">
          ADOS operates with clear, transparent principles: we strictly safeguard your account data, only interact with external advertising networks via official OAuth authorizations, never request or hold platform passwords, and never monetize or sell personal or campaign data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Provision 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                PROVISION 01
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                Guaranteed
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Zero Data Brokering
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never sell or lease your personal, corporate, or campaign performance data to third parties under any circumstances.
            </p>
          </div>

          {/* Provision 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                PROVISION 02
              </span>
              <span className="text-[10px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded font-medium">
                Official APIs
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Platform OAuth 2.0
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access is token-based with encrypted storage. ADOS never requests, sees, or stores your Google or Meta passwords.
            </p>
          </div>

          {/* Provision 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                PROVISION 03
              </span>
              <span className="text-[10px] font-mono text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                On Demand
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Full Erasure Rights
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Permanent removal of your profile, connected accounts, and cached metrics can be requested at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Introduction */}
      <section id="introduction" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">01</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Introduction
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Scope & Overview
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            <strong>ADOS</strong> is an advertising management platform that helps businesses manage and analyze their digital advertising accounts through a centralized dashboard.
          </p>
          <p>
            This Privacy Policy explains how ADOS collects, uses, stores, and protects personal information when you use our services.
          </p>
        </div>
      </section>

      {/* Section 2: Information We Collect */}
      <section id="information-we-collect" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">02</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Information We Collect
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Categories of Data
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>We may collect the following information:</p>

          {/* Clean Editorial Data Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-50 font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 p-3">
              <span className="md:col-span-4">Category</span>
              <span className="md:col-span-8">Description & Scope</span>
            </div>
            {[
              {
                category: "Personal Identification",
                desc: "Name, email address and mobile number.",
              },
              {
                category: "Authentication",
                desc: "Account login and authentication information.",
              },
              {
                category: "Advertising Platforms",
                desc: "Advertising account IDs and connected platform information.",
              },
              {
                category: "Campaign Performance",
                desc: "Advertising campaign data, performance metrics, budgets and analytics.",
              },
              {
                category: "Billing Records",
                desc: "Payment and transaction information, where payment features are enabled.",
              },
              {
                category: "System Diagnostics",
                desc: "Technical information such as IP address, browser type and device information.",
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-3.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
              >
                <span className="md:col-span-4 font-semibold text-slate-900 pb-1 md:pb-0">
                  {row.category}
                </span>
                <span className="md:col-span-8 text-slate-600">
                  {row.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Third-Party Platform Connections */}
      <section id="third-party-connections" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">03</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Third-Party Platform Connections
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Integrations
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS may allow users to connect accounts from third-party advertising platforms, including:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
            {[
              { name: "Google Ads", tag: "Supported" },
              { name: "Facebook Ads", tag: "Supported" },
              { name: "Instagram Ads", tag: "Supported" },
              { name: "LinkedIn Ads", tag: "When supported" },
            ].map((platform, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 text-center space-y-1"
              >
                <span className="font-bold text-slate-900 text-sm block">
                  {platform.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                  {platform.tag}
                </span>
              </div>
            ))}
          </div>

          <p>
            When you connect an advertising account, you authorize ADOS to access the information and perform actions permitted by the permissions you grant.
          </p>
          <p>
            We use official platform APIs and OAuth authorization wherever supported.
          </p>

          <div className="p-4 rounded-lg bg-slate-50 border-l-2 border-slate-900 text-sm text-slate-900 font-medium leading-relaxed">
            <strong>Password Protection Guarantee:</strong> ADOS does not ask users to share their Google or Meta account passwords. Authentication is conducted strictly through official OAuth permission windows.
          </div>
        </div>
      </section>

      {/* Section 4: How We Use Your Information */}
      <section id="how-we-use-information" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">04</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              How We Use Your Information
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Operational Purposes
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>We use collected information to:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800">
            {[
              "Create and manage ADOS user accounts.",
              "Connect authorized advertising accounts.",
              "Display advertising campaign analytics.",
              "Help users monitor advertising performance.",
              "Provide advertising management functionality.",
              "Process payments when applicable.",
              "Improve platform security and performance.",
              "Provide customer support.",
            ].map((purpose, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                <span>{purpose}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Data Sharing */}
      <section id="data-sharing" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">05</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Data Sharing
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Third Parties & Transfers
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <div className="p-4 rounded-lg bg-slate-950 text-white flex items-center justify-between">
            <span className="text-sm font-semibold">
              ADOS does not sell users' personal information.
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Enforced
            </span>
          </div>

          <p>We may share necessary information with:</p>
          <ul className="space-y-2 pl-3 text-sm text-slate-800">
            {[
              "Advertising platforms when authorized actions require it.",
              "Payment service providers for payment processing.",
              "Hosting and infrastructure providers.",
              "Authorities when legally required.",
            ].map((recipient, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>{recipient}</span>
              </li>
            ))}
          </ul>

          <p className="font-semibold text-slate-950 pt-1">
            We do not use connected advertising data for unrelated purposes.
          </p>
        </div>
      </section>

      {/* Section 6: Data Security */}
      <section id="data-security" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">06</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Data Security
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Safeguards
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>
            We use reasonable technical and organizational security measures to protect user information.
          </p>
          <p>
            These may include encrypted token storage, access controls, secure authentication and HTTPS communication.
          </p>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>Security Notice:</strong> However, no internet-based service can guarantee absolute security. Users are responsible for maintaining secure individual login credentials.
          </div>
        </div>
      </section>

      {/* Section 7: Data Retention */}
      <section id="data-retention" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">07</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Data Retention
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Timeline
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            We retain personal information only for as long as necessary to provide our services, comply with legal requirements and resolve disputes.
          </p>
          <p>
            Users may request deletion of their accounts and associated information.
          </p>
        </div>
      </section>

      {/* Section 8: Account and Data Deletion */}
      <section id="account-data-deletion" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">08</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Account and Data Deletion
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            User Rights
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>
            Users can request deletion of their ADOS account and associated data by contacting:
          </p>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Primary Contact
              </span>
              <a
                href="mailto:idrtech23@gmail.com"
                className="font-bold text-slate-950 hover:underline text-sm"
              >
                idrtech23@gmail.com
              </a>
            </div>
            <a
              href="mailto:idrtech23@gmail.com"
              className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-900 hover:bg-black text-white transition-colors"
            >
              Send Request
            </a>
          </div>

          <p>
            For details, visit our Data Deletion Instructions page.
          </p>

          <Link
            to="/data-deletion"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-blue-600 underline"
          >
            <span>Open Data Deletion Instructions page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Section 9: Third-Party Services */}
      <section id="third-party-services" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">09</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Third-Party Services
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            External Policies
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS integrates with third-party services such as Google and Meta. Their respective privacy policies and terms also apply to their services.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  External Provider
                </span>
                <span className="text-sm font-bold text-slate-950 group-hover:underline">
                  Google Privacy Policy
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>

            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  External Provider
                </span>
                <span className="text-sm font-bold text-slate-950 group-hover:underline">
                  Meta Privacy Policy
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 10: Children's Privacy */}
      <section id="childrens-privacy" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">10</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Children's Privacy
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Eligibility
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS is intended for business users and is not designed for children under 18.
          </p>
        </div>
      </section>

      {/* Section 11: Changes to This Policy */}
      <section id="changes-to-policy" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">11</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Changes to This Policy
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Amendments
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            We may update this Privacy Policy when our services or legal requirements change.
          </p>
          <p>
            Updated versions will be published on this page.
          </p>
        </div>
      </section>

      {/* Section 12: Contact Us */}
      <section id="contact-us" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">12</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Contact Us
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Communications
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>For privacy-related questions or requests:</p>
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
