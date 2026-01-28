"use client";

import { FormEvent, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
      ready(cb: () => void): void;
    };
  }
}

type Status = "idle" | "sending" | "ok" | "error";

async function loadRecaptchaScript(siteKey: string) {
  if (typeof window === "undefined") return;
  if (window.grecaptcha) return;

  await new Promise<void>((resolve, reject) => {
    const scriptId = "recaptcha-v3";
    if (document.getElementById(scriptId)) {
      resolve();
      return;
    }

    const s = document.createElement("script");
    s.id = scriptId;
    s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("reCAPTCHA script failed to load"));
    document.head.appendChild(s);
  });
}

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  async function getRecaptchaToken() {
    if (!siteKey) {
      throw new Error("reCAPTCHA site key is not configured.");
    }

    await loadRecaptchaScript(siteKey);

    return await new Promise<string>((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error("reCAPTCHA is not available."));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha!
          .execute(siteKey, { action: "contact_submit" })
          .then(resolve)
          .catch(() => reject(new Error("reCAPTCHA execution failed.")));
      });
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const recaptchaToken = await getRecaptchaToken();

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          company,
          hp,
          recaptchaToken,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(
          (data as any)?.error ?? "送信に失敗しました。時間をおいて再度お試しください。"
        );
        return;
      }

      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
      setCompany("");
      setHp("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(
        err?.message ?? "送信に失敗しました。時間をおいて再度お試しください。"
      );
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <p className="font-body text-xs md:text-sm text-black/60">
        お仕事のご依頼やお問い合わせは、下記フォームよりご連絡ください。
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="contact-name"
            className="block font-body text-xs md:text-sm text-black/80"
          >
            お名前<span className="ml-1 text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-black/20 bg-white px-3 py-2 text-sm md:text-base font-body focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contact-email"
            className="block font-body text-xs md:text-sm text-black/80"
          >
            メールアドレス<span className="ml-1 text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black/20 bg-white px-3 py-2 text-sm md:text-base font-body focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contact-message"
            className="block font-body text-xs md:text-sm text-black/80"
          >
            お問い合わせ内容<span className="ml-1 text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-black/20 bg-white px-3 py-2 text-sm md:text-base font-body focus:outline-none focus:border-black transition-colors resize-vertical"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contact-company"
            className="block font-body text-xs md:text-sm text-black/80"
          >
            会社名（任意）
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-black/20 bg-white px-3 py-2 text-sm md:text-base font-body focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-hp" className="sr-only">
            HP
          </label>
          <input
            id="contact-hp"
            name="hp"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center border border-black bg-black text-white px-6 py-2 text-sm md:text-base font-body tracking-wide hover:bg-white hover:text-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "送信中..." : "送信する"}
        </button>

        <p className="font-body text-[11px] md:text-xs text-black/50">
          ※お問い合わせ内容によっては返信できない場合があります。
        </p>

        {status === "ok" && (
          <p
            role="status"
            className="font-body text-xs md:text-sm text-emerald-600"
          >
            送信が完了しました。お問い合わせありがとうございます。
          </p>
        )}

        {status === "error" && (
          <p
            role="alert"
            className="font-body text-xs md:text-sm text-red-600"
          >
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
}




