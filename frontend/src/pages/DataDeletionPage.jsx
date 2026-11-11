import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LegalLayout from "../components/legal/LegalLayout";
import {
  ExternalLink,
  Copy,
  Check,
  Send,
  ArrowRight,
} from "lucide-react";

export default function DataDeletionPage() {
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [searchParams] = useSearchParams();
  const confirmationCode =
    searchParams.get("id") ||
    searchParams.get("code") ||
    searchParams.get("confirmation_code");

  const tocItems = [
    { id: "overview", label: "1. Overview & Commitment" },
    { id: "how-to-request", label: "2. How to Request Data Deletion" },
    { id: "email-method", label: "• Method 1: Email Request" },
    { id: "in-app-method", label: "• Method 2: Through ADOS" },
    { id: "what-can-be-deleted", label: "3. What Information Can Be Deleted?" },
    { id: "third-party-access", label: "4. Third-Party Account Access" },
    { id: "processing-time", label: "5. Processing Time" },
    { id: "contact", label: "6. Contact" },
  ];

  const emailSubject = "ADOS Account and Data Deletion Request";
  const emailBodyTemplate = `Dear ADOS Privacy Team,

I am requesting the deletion of my ADOS account and associated data.

Account Information:
- Registered ADOS email address: [Insert your email address here]
- Request: Please delete my ADOS user account and profile information.
- Connected Ad Accounts: Please also delete all stored advertising account connection details and OAuth access tokens.

Thank you,
[Your Name]`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(emailBodyTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const mailtoLink = `mailto:idrtech23@gmail.com?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBodyTemplate)}`;

  return (
    <LegalLayout
      title="ADOS User Data Deletion Instructions"
      subtitle="ADOS respects users' privacy and provides a process for requesting deletion of personal information and connected advertising account data."
      category="DATA REMOVAL & ACCOUNT DELETION"
      effectiveDate="November 7, 2026"
      tocItems={tocItems}
    >
      {/* Active Data Deletion Confirmation Status Banner (Meta Compliance) */}
      {confirmationCode && (
        <div className="mb-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-950 shadow-xs">
          <div className="flex items-center gap-2.5 font-bold text-emerald-900 text-base mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Meta Data Deletion Request Processed Successfully
          </div>
          <p className="text-sm text-emerald-800 leading-relaxed mb-3">
            Your data deletion request has been recorded and processed by ADOS in compliance with Meta's platform policies and GDPR / CCPA standards.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-900 bg-emerald-100/70 border border-emerald-200 px-3 py-2 rounded-xl">
            <span className="font-semibold text-emerald-700">Confirmation Reference:</span>
            <code className="font-mono font-bold tracking-wider">{confirmationCode}</code>
          </div>
          <p className="text-xs text-emerald-700/90 mt-3">
            All stored Facebook OAuth access tokens, cached advertising insights, and connected ad accounts associated with this Facebook User ID have been purged from our databases. Your ADOS profile remains intact.
          </p>
        </div>
      )}

      {/* High-End Editorial Key Provisions Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Executive Summary
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
              User Privacy Rights & Removal SLA
            </h2>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded">
            Self-Service & Manual Paths
          </span>
        </div>

        <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed pt-5 pb-6">
          You retain complete ownership over your identity and marketing connection records. If you decide to close your account, ADOS provides clear, straightforward methods to permanently purge your profile, remove cached advertising analytics, and invalidate third-party API tokens.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Provision 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                METHOD 01
              </span>
              <span className="text-[10px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded font-medium">
                Direct Desk
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Email Request
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your request directly to idrtech23@gmail.com with your registered account address.
            </p>
          </div>

          {/* Provision 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                METHOD 02
              </span>
              <span className="text-[10px] font-mono text-purple-800 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded font-medium">
                In-App
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Dashboard Settings
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Self-service deletion available directly under Account Settings &gt; Privacy or Account Management.
            </p>
          </div>

          {/* Provision 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                TIMELINE
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                30 Days
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Standard Processing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified requests are processed within 30 days, removing stored tokens and account details.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Overview */}
      <section id="overview" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">01</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Overview & Commitment
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Commitment
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS respects users' privacy and provides a process for requesting deletion of personal information and connected advertising account data.
          </p>
        </div>
      </section>

      {/* 2. How to Request Data Deletion */}
      <section id="how-to-request" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">02</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              How to Request Data Deletion
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Two Available Methods
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3 text-slate-700 leading-relaxed text-[15px]">
          <p>Users can request deletion using either method:</p>
        </div>
      </section>

      {/* Method 1: Email Request */}
      <section id="email-method" className="scroll-mt-28 space-y-4">
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-950">
              Method 1: Email Request
            </h3>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Manual Dispatch
            </span>
          </div>

          <p>
            Send an email to:{" "}
            <a
              href="mailto:idrtech23@gmail.com"
              className="font-bold text-slate-950 hover:underline"
            >
              idrtech23@gmail.com
            </a>
          </p>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="font-mono font-bold uppercase text-slate-500">
              Required Information Checklist:
            </div>
            <div className="space-y-1 text-slate-800">
              <div>
                <span className="font-mono text-slate-400">Subject: </span>
                <span className="font-semibold text-slate-900">
                  ADOS Account and Data Deletion Request
                </span>
              </div>
              <div className="pt-1">
                <span className="font-mono text-slate-400">Details to Include: </span>
                <ul className="list-disc pl-5 pt-1 space-y-1 text-slate-700">
                  <li>Registered ADOS email address.</li>
                  <li>Your request to delete your account.</li>
                  <li>Whether you also want connected advertising account data deleted.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={mailtoLink}
              className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose Pre-Filled Email</span>
            </a>

            <button
              onClick={handleCopyTemplate}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedTemplate ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Template Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Template</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Method 2: Through ADOS */}
      <section id="in-app-method" className="scroll-mt-28 space-y-4">
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-950">
              Method 2: Through ADOS
            </h3>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Self-Service
            </span>
          </div>

          <p>Where the account deletion feature is available:</p>

          <ol className="space-y-2 pl-1">
            {[
              "Log in to ADOS.",
              "Open Account Settings.",
              "Navigate to Privacy or Account Management.",
              "Select Delete Account.",
              "Confirm your deletion request.",
            ].map((step, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 text-xs sm:text-sm font-medium text-slate-900"
              >
                <span className="font-mono text-xs font-bold text-slate-400 w-5">
                  0{idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="pt-2">
            <Link
              to="/settings"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:underline"
            >
              <span>Go to ADOS Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. What Information Can Be Deleted? */}
      <section id="what-can-be-deleted" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">03</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              What Information Can Be Deleted?
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Scope
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>
            Depending on applicable legal and technical requirements, deletion may include:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800">
            {[
              "ADOS account information.",
              "Personal profile information.",
              "Stored advertising account connection details.",
              "OAuth access and refresh tokens held by ADOS.",
              "Associated advertising analytics stored by ADOS.",
              "Other account-related information.",
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Third-Party Account Access */}
      <section id="third-party-access" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">04</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Third-Party Account Access
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Token Revocation
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>
            Users can also revoke ADOS permissions through their connected Google or Meta account settings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Google Security
                </span>
                <span className="text-sm font-bold text-slate-950 group-hover:underline">
                  Manage Google Account Permissions
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>

            <a
              href="https://www.facebook.com/settings?tab=business_tools"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Meta Business Tools
                </span>
                <span className="text-sm font-bold text-slate-950 group-hover:underline">
                  Manage Meta Connected Apps
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong>Platform Account Preservation:</strong> Deleting your ADOS account does not automatically delete your Google, Facebook, Instagram or other advertising platform accounts. Your external accounts and ad balances remain intact directly with those platforms.
          </div>
        </div>
      </section>

      {/* 5. Processing Time */}
      <section id="processing-time" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">05</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Processing Time
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Verification SLA
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-3.5 text-slate-700 leading-relaxed text-[15px]">
          <p>
            ADOS will verify deletion requests before processing them.
          </p>
          <p>
            We aim to process verified requests within 30 days, subject to applicable legal requirements and technical limitations.
          </p>
          <p className="text-xs text-slate-500 pt-1">
            Some information may be retained where legally required or necessary for legitimate security, accounting or dispute-resolution purposes.
          </p>
        </div>
      </section>

      {/* 6. Contact */}
      <section id="contact" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-200/90 pb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">06</span>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Contact
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">
            Compliance Desk
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/90 space-y-4 text-slate-700 leading-relaxed text-[15px]">
          <p>For account and data deletion requests:</p>
          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-sm">
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
              <span className="text-slate-400 font-mono text-xs">Platform: </span>
              <span className="font-semibold text-slate-900">ADOS</span>
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
