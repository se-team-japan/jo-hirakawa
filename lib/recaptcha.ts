const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export type RecaptchaVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export async function verifyRecaptcha(
  token: string
): Promise<RecaptchaVerifyResponse> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    throw new Error("RECAPTCHA_SECRET_KEY is not configured.");
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error("Failed to verify reCAPTCHA.");
  }

  const data = (await res.json()) as RecaptchaVerifyResponse;
  return data;
}




