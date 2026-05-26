"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^[0-9+\s-]{8,16}$/),
  city: z.string().optional(),
  message: z.string().min(5),
});

export type ContactFormInput = z.infer<typeof contactSchema>;

type Result = { ok: true } | { ok: false; error: string };

/**
 * Server action — accepts a validated contact submission.
 *
 * Phase-1 implementation: logs to the server console. Phase-3 wires a real
 * email delivery via Resend (or similar) using process.env.RESEND_API_KEY.
 * Keeping the action signature stable so the front-end doesn't change when
 * the transport is added.
 */
export async function submitContactForm(input: ContactFormInput): Promise<Result> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "البيانات المدخلة غير صحيحة." };
  }

  // TODO(phase-3): send email via Resend/SMTP using business.email as the recipient.
  console.log("[contact-form]", new Date().toISOString(), parsed.data);

  return { ok: true };
}
