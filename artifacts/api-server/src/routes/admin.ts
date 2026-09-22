import { Router, type IRouter, type Request } from "express";
import crypto from "node:crypto";
import { getAuth } from "@clerk/express";

const router: IRouter = Router();
const COOKIE_NAME = "saas_hub_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function signingKey() {
  return process.env.SAAS_HUB_ADMIN_PASSWORD ?? "";
}

function signature(payload: string) {
  return crypto.createHmac("sha256", signingKey()).update(payload).digest("hex");
}

function hasAdminCookie(req: Request) {
  const raw = req.headers.cookie
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  if (!raw) return false;
  const [payload, provided] = raw.split(".");
  if (!payload || !provided || !signingKey()) return false;
  const expected = signature(payload);
  if (provided.length !== expected.length) return false;
  const validSignature = crypto.timingSafeEqual(
    Buffer.from(provided),
    Buffer.from(expected),
  );
  const issuedAt = Number(payload);
  return validSignature && Number.isFinite(issuedAt) &&
    Date.now() - issuedAt < MAX_AGE_SECONDS * 1000;
}

function clerkIsAuthenticated(req: Request) {
  return getAuth(req).isAuthenticated;
}

router.get("/admin/access", (req, res): void => {
  if (!signingKey()) {
    res.status(503).json({ authorized: false });
    return;
  }
  res.json({ authorized: clerkIsAuthenticated(req) && hasAdminCookie(req) });
});

router.post("/admin/access", (req, res): void => {
  const configuredPassword = signingKey();
  if (!configuredPassword) {
    res.status(503).json({ authorized: false });
    return;
  }
  if (!clerkIsAuthenticated(req)) {
    res.status(401).json({ authorized: false });
    return;
  }

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password || password !== configuredPassword) {
    res.status(403).json({ authorized: false });
    return;
  }

  const payload = String(Date.now());
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${payload}.${signature(payload)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}${secure}`,
  );
  res.json({ authorized: true });
});

router.delete("/admin/access", (_req, res) => {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
  );
  res.json({ authorized: false });
});

export default router;