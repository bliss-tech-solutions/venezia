import { NextResponse } from "next/server";

/**
 * Enquiry endpoint.
 * Wire this to your CRM / email service (e.g. HubSpot, Salesforce, Resend).
 * For now it validates and logs the lead on the server.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "Name and phone are required" }, { status: 422 });
  }

  const lead = {
    name,
    phone,
    email: String(body.email ?? "").trim(),
    interest: String(body.interest ?? "").trim(),
    when: String(body.when ?? "").trim(),
    message: String(body.message ?? "").trim().slice(0, 2000),
    receivedAt: new Date().toISOString(),
  };

  console.log("[venezia] new enquiry", lead);
  return NextResponse.json({ ok: true });
}
