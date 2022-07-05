import loginTemplate from "./views/login.js";
import consentTemplate from "./views/consent.js";
import ejs from "ejs";
import crypto from "crypto";
import { interactionUrl } from "./provider.js";

export function renderLogin(req, res, data, flash) {
  const userid = getUserId(req);
  const hint = userid ? { login_hint: userid } : undefined;
  const params = data(hint);
  const method = getMethod(req);
  let nonce = crypto.randomBytes(16).toString("base64");
  const template = loginTemplate(method, nonce);
  const html = ejs.render(template, {
    ...params,
    title: "Welcome!",
    subtitle: "Catch your data easily.",
    flash,
  });
  res.send(html, 200, {
    "content-type": "text/html; charset=utf-8",
    "content-security-policy": `script-src 'nonce-${nonce}'`,
  });
}

export function renderConsent(req, res, data) {
  const params = data();
  const template = consentTemplate();
  const html = ejs.render(template, {
    ...params,
    title: "Consent",
  });
  res.send(html, 200, { "content-type": "text/html; charset=utf-8" });
}

export function redirectToLogin(req, res, data, reason) {
  const flash = reason ?? whyLoginFailed(req);
  return renderLogin(req, res, data, flash);
}

export function redirectToCodeAuthentication(req, res) {
  const method = getCodeMethod(req);
  const userid = getUserId(req);
  const name = getUserName(req);
  const surname = getUserSurname(req);
  const organization = getUserOrganization(req)
  const role = getUserRole(req);
  const phone = getUserPhone(req);
  const location = interactionUrl({query: { userid, method, name, surname, organization, role, phone }}, {uid: req.params.uid});
  res.send("", 303, {
    Location: location,
  });
}

export function askedForCode(req) {
  return "send-code" in req.query;
}

export function notificationNeeded(req) {
  const method = getMethod(req);
  return method.startsWith("code") && !method.endsWith("retry");
}

export function isMagic(req) {
  const method = getMethod(req);
  return method == "magic";
}

export function getUserId(req) {
  const method = getMethod(req);
  return method == "password"
    ? req.body?.email
    : req.body?.userid ?? req.query.userid;
}

export function getUserName(req) {
  return req.query?.name ?? req.body?.name;
}

export function getUserSurname(req) {
  return req.query?.surname ?? req.body?.surname;
}

export function getUserOrganization(req) {
  return req.query?.organization ?? req.body?.organization;
}

export function getUserRole(req) {
  return req.query?.role ?? req.body?.role;
}

export function getUserPhone(req) {
  return req.query?.phone ?? req.body?.phone;
}

export function getPassword(req) {
  const { password, password2 } = req.body;
  return { password, password2 };
}

function getCodeMethod(req) {
  const method = getMethod(req);
  return method == "password" || method.startsWith("code,reset")
    ? "code,reset"
    : "code";
}

function askedForSignin(req) {
  return /\?.*sign-in/.test(req.originalUrl);
}

function getMethod(req) {
  return req.query.method ?? req.body.method ?? "password";
}

function whyLoginFailed(req) {
  const method = getMethod(req);
  return askedForSignin(req)
    ? method == "password"
      ? "Invalid email or password"
      : "Invalid code"
    : undefined;
}

export function askedForSignUp(req) {
  return "sign-up" in req.query;
}
