import crypto from "node:crypto";

const COOKIE_NAME = "saas_hub_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function key() {
  return process.env.SAAS_HUB_ADMIN_PASSWORD || "";
}

function sign(payload) {
  return crypto.createHmac("sha256", key()).update(payload).digest("hex");
}

function hasCookie(req) {
  const raw = (req.headers.cookie || "")
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  if (!raw || !key()) return false;
  const [payload, provided] = raw.split(".");
  if (!payload || !provided) return false;
  const expected = sign(payload);
  const issuedAt = Number(payload);
  return provided.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected)) &&
    Number.isFinite(issuedAt) &&
    Date.now() - issuedAt < MAX_AGE_SECONDS * 1000;
}

export default function handler(req, res) {
  if (!key()) return res.status(503).json({ authorized: false });

  if (req.method === "GET") {
    return res.json({ authorized: hasCookie(req) });
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
    return res.json({ authorized: false });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ authorized: false });
  }

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password || password !== key()) {
    return res.status(403).json({ authorized: false });
  }

  const payload = String(Date.now());
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${payload}.${sign(payload)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}; Secure`,
  );
  return res.json({ authorized: true });
}