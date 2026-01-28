import { NextRequest, NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { getTransporter } from "@/lib/mailer";
import { rateLimit } from "@/lib/rateLimit";

const limiter = rateLimit();

function escapeHeader(v: string) {
  return v.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.ip ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const result = limiter.check(`contact:${ip}`);
    if (!result.allowed) {
      return NextResponse.json(
        { error: "短時間に多数の送信が行われたため、一時的にブロックされています。" },
        { status: 429 }
      );
    }

    const body = await req.json();

    // honeypot: 値が入っていたら成功扱いで握り潰し
    if (body.hp && String(body.hp).length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const company = String(body.company || "").trim();
    const recaptchaToken = String(body.recaptchaToken || "");

    if (!name || !email || !message || !recaptchaToken) {
      return NextResponse.json(
        { error: "入力内容を確認してください" },
        { status: 400 }
      );
    }

    const ver = await verifyRecaptcha(recaptchaToken);
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);

    if (!ver.success) {
      console.error("reCAPTCHA verification failed:", {
        errorCodes: ver["error-codes"],
        hostname: ver.hostname,
      });
      return NextResponse.json(
        { error: "reCAPTCHAに失敗しました" },
        { status: 403 }
      );
    }
    if ((ver.score ?? 0) < minScore) {
      return NextResponse.json(
        { error: "スパムの可能性があるため送信できません" },
        { status: 403 }
      );
    }
    if (ver.action && ver.action !== "contact_submit") {
      return NextResponse.json(
        { error: "reCAPTCHA action mismatch" },
        { status: 403 }
      );
    }

    const to = process.env.CONTACT_TO_EMAIL || "info@example.com";
    const from = process.env.MAIL_FROM || "no-reply@example.com";

    const subject = escapeHeader(`[お問い合わせ] ${name}`);
    const text = [
      `お名前: ${name}`,
      `メール: ${email}`,
      company ? `会社名: ${company}` : null,
      "",
      "--- 本文 ---",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const transporter = getTransporter();

    await transporter.sendMail({
      to,
      from,
      subject,
      text,
      replyTo: escapeHeader(email),
    });

    // 送信者への自動返信: デフォルトOFF
    const enableAutoReply = false;
    if (enableAutoReply) {
      // 将来的にONにしたい場合: SPF/DKIM/DMARC整備後などの条件でtrueに
      await transporter.sendMail({
        to: email,
        from,
        subject: "お問い合わせありがとうございます",
        text: [
          `${name} 様`,
          "",
          "この度はお問い合わせいただきありがとうございます。",
          "以下の内容で受け付けました。",
          "",
          `お名前: ${name}`,
          company ? `会社名: ${company}` : null,
          "",
          "--- お問い合わせ内容 ---",
          message,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      name: err instanceof Error ? err.name : undefined,
    });
    return NextResponse.json(
      { error: "サーバー側でエラーが発生しました" },
      { status: 500 }
    );
  }
}




