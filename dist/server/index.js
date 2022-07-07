import restana from 'restana';
import bodyParser from 'body-parser';
import debug from 'debug';
import ejs from 'ejs';
import crypto from 'crypto';
import Provider from 'oidc-provider';
import { Issuer, generators } from 'openid-client';
import open from 'open';
import assert from 'assert';
import { Stealer } from 'stealer';
import uuid from 'uuid-random';

class Account {
  constructor(userid, surveys, args) {
    Object.assign(this, args);
    this.userid = userid;
    this.surveys = surveys;
    this.magic = args.password
      ? Buffer.from(JSON.stringify([userid, args.password])).toString("base64")
      : undefined;
  }

  static create(account) {
    return new Account(account.userid, JSON.parse(account.surveys), {
      sub: account.id,
      email_verified: !!account.email_verified,
      given_name: account.given_name,
      surname: account.surname,
      title: account.title,
      phone: account.phone,
      id: account.id,
      email: account.email,
      password: account.password,
      salt: account.salt,
      extra_infos: JSON.parse(account.extra_infos),
    });
  }
}

class AccountManager {
  constructor(client) {
    this.client = client;
  }

  authenticate({ method, email, password, magic, userid, code, role }) {
    if (method == "magic") {
      method = "password";
      const [u, p] = JSON.parse(Buffer.from(magic, "base64").toString());
      userid = u;
      password = p;
    }
    return this.tryAuthenticate(
      method,
      email?.trim(),
      password?.trim(),
      userid?.trim(),
      code?.trim(),
      role
    ).catch(() => {});
  }

  tryAuthenticate(method, email, password, userid, code, role) {
    return !method || method == "password"
      ? this.passwordAuthenticate(email ?? userid, password)
      : method.startsWith("code")
      ? this.codeAuthenticate(userid, code)
      : this.roleAuthenticate(role);
  }

  async passwordAuthenticate(email, password) {
    assert(password, "Password must be provided");
    assert(email, "email must be provided");
    const account = await this.getByUserid(email);

    const h = await hash(password, account.salt);
    assert(h == account.password, `Invalid credentials provided`);

    return account.id;
  }

  async codeAuthenticate(userid, code) {
    assert(code, "Code must be provided");
    const { tries, code: c, name, surname, organization, role, phone } = getCode(userid);
    if (tries > 0) setCode(userid, c, tries - 1);
    else delCode(userid);
    assert(tries > 0 && code == c, "Invalid code provided");
    const account = await this.getByUserid(userid);
    if (account) return account.id;
    const newAccount = new Account(
      userid,
      {},
      {
        email: userid,
        email_verified: true,
        given_name: name,
        surname,
        phone,
        extra_infos: { organization, role },
      }
    );
    const saved = await this.save(newAccount);
    return saved.id;
  }

  async roleAuthenticate(role) {
    assert(role, "Role must be provided");
    const account = await this.getByUserid(role);
    return account.id;
  }

  async findOIDCAccount(ctx, id) {
    const account = await this.getById(id);
    return AccountManager.accountWithClaims(account);
  }

  static accountWithClaims(account) {
    return account
      ? {
          accountId: account.id,
          async claims() {
            return Account.create(account);
          },
        }
      : undefined;
  }

  async getBySurvey(survey) {
    const all = await this.getAll();
    return all.filter(a => Object.keys(a.surveys).includes(survey));
  }

  async getById(id) {
    return await this.client
      .table("accounts")
      .where({ id: id })
      .then(r => r[0]);
  }

  async getByUserid(userid) {
    const uid = String(userid).toLowerCase();
    const result = await this.client
      .table("accounts")
      .where({ userid: uid })
      .select()
      .first();
    const account = result ? Account.create(result) : undefined;
    return account;
  }

  async getAll() {
    const allAccounts = await this.client.table("accounts");
    return allAccounts.map(Account.create);
  }

  async save(account) {
    const password = await passwordRecord(account.password);
    const record = accountRecord(account, password);
    const c = await this.client
      .table("accounts")
      .where("id", "!=", record.id)
      .andWhere("userid", record.userid)
      .count({ count: "*" })
      .first();
    if (c.count > 0)
      return Promise.reject(`Account ${record.userid} already exists`);
    await this.client.table("accounts").insert(record).onConflict("id").merge();
    return Object.assign(account, { id: record.id });
  }
}

const codes = new Stealer({ ttl: 600, unref: true });

function getCode(userid) {
  const lowercased = String(userid).toLowerCase();
  return codes.get(lowercased);
}

function setCode(userid, code, tries, kwargs) {
  const lowercased = String(userid).toLowerCase();
  codes.set(lowercased, { tries, code, ...kwargs });
}

function delCode(userid) {
  const lowercased = String(userid).toLowerCase();
  codes.delete(lowercased);
}

async function generateCode({ userid, name, surname, organization, role, phone }) {
  const code = await randomCode();
  setCode(userid, code, 3, { name, surname, organization, role, phone });
  return code;
}

function randomCode() {
  const a = new Uint32Array(6);
  return new Promise((res, rej) =>
    crypto.randomFill(a, (err, buf) => {
      if (err) rej(err);
      const code = createCode(buf);
      res(code);
    })
  );
}

function createCode(buf) {
  const symbols = "0123456789";
  const code = buf.map(i => symbols[i % symbols.length]).join("");
  return code;
}

async function passwordRecord(password) {
  if (!password) return {};
  const salt = crypto.randomBytes(16).toString("hex");
  const h = await hash(password, salt);
  return { salt, password: h };
}

async function hash(password, salt) {
  return new Promise(r =>
    crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, h) =>
      r(h.toString("hex"))
    )
  );
}

function accountRecord(account, password) {
  return {
    id: account.id ?? uuid(),
    userid: String(account.userid ?? account.email).toLowerCase(),
    email: account.email,
    email_verified: account.email_verified,
    given_name: account.given_name,
    surname: account.surname,
    title: account.title,
    phone: account.phone,
    surveys:
      typeof account.surveys == "string"
        ? account.surveys
        : JSON.stringify(account.surveys),
    ...password,
    extra_infos:
      typeof account.extra_infos == "string"
        ? account.extra_infos
        : JSON.stringify(account.extra_infos),
  };
}

function loginTemplate (method, nonce) {
  return `<!DOCTYPE html>
  <html >
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <title>Sign-in</title>
      <link rel="stylesheet" href="/style/style.css">
    </head>
    <body>
      <script nonce="${nonce}" type="module">
        import { i18n, Login, h, createApp } from "/app.vue.js";

        const app = createApp({
          render() {
            return h(Login, {
              title: "<%= locals.title %>", 
              subtitle: "<%= locals.subtitle %>", 
              saasMode: "<%= locals.saasMode %>", 
              uid: "<%= locals.uid %>",
              method: "${method}",
              loginHint: "<%= locals.params.login_hint %>",
              flash: "<%= locals.flash %>"
            })
          }
        });
        app.use(i18n)
        app.mount("#app");
      </script>
      <div id="app">
      </div>
    </body>
  </html>`;
}

function consentTemplate () {
  return `<!DOCTYPE html>
  <html >
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Consent</title>
    </head>
    <body>
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="card-title mb-3"><%= locals.title %></h5>
            </div>
              <% if (params.scope && params.scope.includes('offline_access')) { %>
                <div class="alert alert-danger m-3">
                  The client is asking to have offline access : it will be able to access permanently to the backend resource
                </div>
              <% } %>
              <form autocomplete="off" action="/oidc/interaction/<%= uid %>/confirm" method="post">
                <div class="modal-footer">
                  <button id="consent" autofocus type="submit" class="btn btn-primary float-end">Continue</button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </body>
  </html>`
}

function logout(form) {
  return `<!DOCTYPE html>
    <head>
      <title>Logout Request</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
      <style>
        body {
          color: white;
        }
        .modal {
          background-color: #2d3252 !important;
        }
        .modal-content {
          background: linear-gradient(0.75turn, #002bb5, #1a55a1);
          box-shadow: 0px 0px 10px black !important;
          height: 100% !important;
          position: absolute;
        }
        .modal-dialog {
          max-width: 30% !important;
          min-height: 30% !important;
          top: 20% !important;
          position: relative !important;
        }
        .btn-danger {
          background-color: #a00007 !important;
        }
        .btn {
          font-size: 1.25rem !important;
        }
        @media only screen and (max-width: 992px) {
          .modal-dialog {
            max-width: 95% !important;
          }
        }
      </style>
    </head>
    <body>
      <div>${form}</div>
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header border-0 col">
              <h4 class="card-title mb-3 mx-auto">Sign out ?</h5>
            </div>
            <div class="modal-body border-0 d-grid gap-2">
              <button id="logout" class="btn btn-danger" type="submit" form="op.logoutForm" value="yes" name="logout">Confirm</button>
              <button class="btn btn-outline-light" type="submit" form="op.logoutForm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

const protocol = ["integration", "development"].includes(
  process.env.APP_ENV ?? "development"
)
  ? "http"
  : "https";
const port = process.env.CLIENT_PORT ?? "8080";

const issuer = `${protocol}://${process.env.AUTH_URL}:${port}/oidc`;
const callbackRoot =
  process.env.CALLBACK_ROOT_URL ?? `http://localhost:${port}/callback`;

const uaskTest = {
  client_id: "uask-test",
  response_types: ["id_token"],
  grant_types: ["implicit"],
  redirect_uris: [callbackRoot],
  token_endpoint_auth_method: "none",
  post_logout_redirect_uris: [`${callbackRoot}-logout`],
};

const uask = {
  client_id: "uask",
  response_types: ["code"],
  grant_types: ["authorization_code"],
  redirect_uris: [callbackRoot, `${callbackRoot}-renew`],
  token_endpoint_auth_method: "none",
  post_logout_redirect_uris: [`${callbackRoot}-logout`],
};

const uaskClient = {
  client_id: "uask-client",
  client_secret: "RKO2SFw6rdv1FfHbbm",
  response_types: ["code"],
  grant_types: ["authorization_code"],
  redirect_uris: ["http://127.0.0.1:5505/callback"],
  token_endpoint_auth_method: "none",
};

const features = {
  encryption: { enabled: true },
  introspection: { enabled: true },
  revocation: { enabled: true },
  devInteractions: { enabled: false },
  rpInitiatedLogout: {
    logoutSource,
  },
};

const interactions = {
  url: interactionUrl,
};

const claims = {
  openid: ["sub"],
  email: ["email", "email_verified"],
  profile: [
    "given_name",
    "surname",
    "title",
    "phone",
    "surveys",
    "userid",
    "id",
    "extra_infos"
  ],
};

const jwks = process.env.AUTH_JWKS;

const options = {
  clients:
    process.env.APP_ENV == "development"
      ? [uask, uaskClient, uaskTest]
      : [uask, uaskClient],

  cookies: {
    keys: ["8A'.+2n)Z{VK`A~g", "7<k6;:mb}N/4Kc~%", "S4BrFLX%+/f__G^a"],
  },
  jwks: JSON.parse(jwks ?? "{}"),
  pkce: {
    required: true,
  },
  features,
  claims,
  interactions,
  loadExistingGrant,
  ttl: {
    AccessToken: 1800,
    Session: 1800,
    IdToken: 1800,
    Interaction: 1800,
    Grant: 604800,
  },
};

async function logoutSource(ctx, form) {
  ctx.body = logout(form);
}

async function loadExistingGrant(ctx) {
  const grant = new ctx.oidc.provider.Grant({
    clientId: ctx.oidc.client.clientId,
    accountId: ctx.oidc.session.accountId,
  });

  grant.addOIDCScope("openid email profile");
  await grant.save();
  return grant;
}

function provider(adapter, findAccount) {
  const provider = new Provider(issuer, { ...options, findAccount, adapter });

  provider.proxy = true;

  if (protocol == "http") {
    enableDevProtocol(provider);
  }

  return provider;
}

function enableDevProtocol(provider) {
  const { invalidate: orig } = provider.Client.Schema.prototype;

  provider.Client.Schema.prototype.invalidate = function invalidate(
    message,
    code
  ) {
    if (
      code === "implicit-force-https" ||
      code === "implicit-forbid-localhost"
    ) {
      return;
    }

    orig.call(this, message);
  };
}

function interactionUrl(ctx, interaction) {
  return `/oidc/interaction/${interaction.uid}?method=${
    ctx.query.method ?? "password"
  }${ctx.query.userid ? `&userid=${ctx.query.userid}` : ""}${
    ctx.query.magic ? `&magic=${ctx.query.magic}` : ""
  }${ctx.query.userid ? `&name=${ctx.query.name}` : ""}${
    ctx.query.surname ? `&surname=${ctx.query.surname}` : ""
  }${ctx.query.organization ? `&organization=${ctx.query.organization}` : ""}${ctx.query.role ? `&role=${ctx.query.role}` : ""}${ctx.query.phone ? `&phone=${ctx.query.phone}` : ""}`;
}

function renderLogin(req, res, data, flash) {
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
    saasMode: process.env.SAAS_MODE != "false",
    flash,
  });
  res.send(html, 200, {
    "content-type": "text/html; charset=utf-8",
    "content-security-policy": `script-src 'nonce-${nonce}'`,
  });
}

function renderConsent(req, res, data) {
  const params = data();
  const template = consentTemplate();
  const html = ejs.render(template, {
    ...params,
    title: "Consent",
  });
  res.send(html, 200, { "content-type": "text/html; charset=utf-8" });
}

function redirectToLogin(req, res, data, reason) {
  const flash = reason ?? whyLoginFailed(req);
  return renderLogin(req, res, data, flash);
}

function redirectToCodeAuthentication(req, res) {
  const method = getCodeMethod(req);
  const userid = getUserId(req);
  const name = getUserName(req);
  const surname = getUserSurname(req);
  const organization = getUserOrganization(req);
  const role = getUserRole(req);
  const phone = getUserPhone(req);
  const location = interactionUrl({query: { userid, method, name, surname, organization, role, phone }}, {uid: req.params.uid});
  res.send("", 303, {
    Location: location,
  });
}

function askedForCode(req) {
  return "send-code" in req.query;
}

function notificationNeeded(req) {
  const method = getMethod(req);
  return method.startsWith("code") && !method.endsWith("retry");
}

function isMagic(req) {
  const method = getMethod(req);
  return method == "magic";
}

function getUserId(req) {
  const method = getMethod(req);
  return method == "password"
    ? req.body?.email
    : req.body?.userid ?? req.query.userid;
}

function getUserName(req) {
  return req.query?.name ?? req.body?.name;
}

function getUserSurname(req) {
  return req.query?.surname ?? req.body?.surname;
}

function getUserOrganization(req) {
  return req.query?.organization ?? req.body?.organization;
}

function getUserRole(req) {
  return req.query?.role ?? req.body?.role;
}

function getUserPhone(req) {
  return req.query?.phone ?? req.body?.phone;
}

function getPassword(req) {
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

function askedForSignUp(req) {
  return "sign-up" in req.query;
}

const dlog = debug("uask-auth:service");

function service(provider, accountManager, notify = console.log) {
  const service = restana().newRouter();
  service.use(setNoCache);
  service.use(setHost);
  registerInteractions(provider, notify, accountManager, service);
  service.use(provider.callback());
  return service;
}

function setNoCache(req, res, next) {
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Cache-Control", "no-cache, no-store");
  next();
}

const authUrl$1 =
  process.env.AUTH_URL ??
  `http://localhost:${process.env.AUTH_PORT ?? 3000}/oidc`;

function setHost(req, res, next) {
  const host = new URL(authUrl$1).host;
  req.headers.host = host;
  next();
}

function registerInteractions(provider, notify, accountManager, service) {
  const manager = new InteractionManager(provider, notify, accountManager);

  service.get("/interaction/:uid", (req, res, next) =>
    manager.interaction(req, res, next)
  );
  const parse = bodyParser.urlencoded({ extended: false });
  service.post("/interaction/:uid/confirm", parse, (req, res, next) =>
    manager.confirm(req, res, next)
  );
  service.post("/interaction/:uid/login", parse, (req, res, next) =>
    manager.login(req, res, next)
  );
  service.get("/interaction/:uid/abort", parse, (req, res, next) =>
    manager.abort(req, res, next)
  );
  service.interactionManager = manager;
}

class InteractionManager {
  constructor(provider, notify, accountManager) {
    this.accountManager = accountManager;
    this.provider = provider;
    this.notify = notify;
  }

  interaction(req, res, next) {
    return this.startInteraction(req, res).catch(e => next(e));
  }

  login(req, res, next) {
    return (askedForSignUp(req)
      ? this.changeForCodeRegistering(req, res)
      : askedForCode(req)
      ? this.changeForCodeAuthentication(req, res)
      : this.proceedWithAuthentication(req, res)
    ).catch(e => next(e));
  }

  async confirm(req, res) {
    const result = {
      consent: {},
    };
    return this.provider.interactionFinished(req, res, result, {
      mergeWithLastSubmission: true,
    });
  }

  abort(req, res, next) {
    const result = {
      error: "access_denied",
      error_description: "End-User aborted interaction",
    };
    const options = { mergeWithLastSubmission: false };
    return this.provider
      .interactionFinished(req, res, result, options)
      .catch(e => next(e));
  }

  async startInteraction(req, res) {
    dlog(`authentication started (${req.params.uid})`);
    const { name, data } = await this.getDetails(req, res);
    if (name == "consent") renderConsent(req, res, data);
    else if (isMagic(req)) await this.loginMagic(req, res);
    else {
      await this.sendCodeIfNecessary(req);
      renderLogin(req, res, data);
    }
  }

  async loginMagic(req, res) {
    const accountId = await this.accountManager.authenticate(req.query);
    if (accountId) await this.loginCompleted(req, res, accountId);
    else await this.loginNotCompleted(req, res, "invalid connection link");
  }

  async changeForCodeAuthentication(req, res) {
    const userid = getUserId(req);
    const lowercased = String(userid).toLowerCase();
    const account = await this.accountManager.getByUserid(lowercased);
    if (account) {
      redirectToCodeAuthentication(req, res);
    } else {
      return this.loginNotCompleted(
        req,
        res,
        "No account associated with this email"
      );
    }
  }

  async proceedWithAuthentication(req, res) {
    await this.accountManager
      .authenticate({ ...req.body, ...req.query })
      .then(async accountId => {
        if (accountId) await this.authenticationSucceed(req, res, accountId);
        else await this.loginNotCompleted(req, res);
      });
  }

  async changeForCodeRegistering(req, res) {
    const userid = getUserId(req);
    const lowercased = String(userid).toLowerCase();
    const account = await this.accountManager.getByUserid(lowercased);
    if (account) {
      this.signupNotCompleted(
        req,
        res,
        "An account is already associated with this email"
      );
    } else {
      redirectToCodeAuthentication(req, res);
    }
  }

  async authenticationSucceed(req, res, accountId) {
    const { password, password2 } = getPassword(req);
    if (password2 && password != password2)
      await this.loginNotCompleted(req, res, "Passwords don't match");
    else {
      await this.changePasswordIfAsked(req, accountId);
      dlog(`authentication succeed (${req.params.uid})`);
      await this.loginCompleted(req, res, accountId);
    }
  }

  async changePasswordIfAsked(req, accountId) {
    const { password, password2 } = getPassword(req);
    if (password2) {
      const account = await this.accountManager.getById(accountId);
      await this.accountManager.save({ ...account, password });
    }
  }

  async loginCompleted(req, res, accountId) {
    const options = { mergeWithLastSubmission: false };
    const result = { login: { accountId } };
    await this.provider.interactionFinished(req, res, result, options);
  }

  async signupNotCompleted(req, res, reason) {
    dlog(`signup request failed (${req.params.uid}): ${reason}`);
    const { data } = await this.getDetails(req, res);
    await redirectToLogin(req, res, data, reason);
  }

  async loginNotCompleted(req, res, reason) {
    dlog(`authentication failed (${req.params.uid}): ${reason}`);
    const { data } = await this.getDetails(req, res);
    await this.sendCodeIfNecessary(req);
    await redirectToLogin(req, res, data, reason);
  }

  async sendCodeIfNecessary(req) {
    if (notificationNeeded(req)) {
      await this.sendAuthenticationCode(req);
    }
  }

  async sendAuthenticationCode(req) {
    const userid = getUserId(req);
    const name = getUserName(req);
    const surname = getUserSurname(req);
    const organization = getUserOrganization(req);
    const role = getUserRole(req);
    const phone = getUserPhone(req);
    const code = await generateCode({ userid, name, surname, organization, role, phone });
    const lowercased = String(userid).toLowerCase();
    const account = await this.accountManager.getByUserid(lowercased);
    await this.notify(
      account ?? new Account(lowercased, {}, { email: lowercased }),
      { userid: lowercased, code }
    );
  }

  getData(details, client, params) {
    return {
      client,
      uid: details.uid,
      details: details.prompt.details,
      params: { ...details.params, ...params },
    };
  }

  async getDetails(req, res) {
    const details = await this.provider.interactionDetails(req, res);
    const client = await this.provider.Client.find(details.params.client_id);
    return {
      name: details.prompt.name,
      data: p => this.getData(details, client, p),
    };
  }
}

const authUrl =
  process.env.AUTH_URL ??
  `http://localhost:${process.env.AUTH_PORT ?? 3000}/oidc`;

class Client {
  constructor(url, callback) {
    this.url = url ?? authUrl;
    this.clientPromise = this.discover();
    this.localServer = this.startLocalServer();
    this.callback = callback;
  }

  startLocalServer() {
    const localServer = restana();
    localServer.start(5505);
    localServer.use("/callback", async (req, res) => {
      const tokenSet = await this.endUserAuthentication(
        req,
        this.code_verifier,
        this.state
      );
      if(this.callback)
        res.send("", 301, {
          location: this.callback
        });
      else res.send("You have been authenticated");
      this.tokenResolver(tokenSet);
    });
    return localServer;
  }

  discover() {
    return Issuer.discover(this.url)
      .then(iss => {
        return new iss.Client({
          client_id: "uask-client",
          response_types: ["code"],
          token_endpoint_auth_method: "none",
        });
      })
      .catch(e => console.error(e));
  }

  authenticate() {
    const { code_challenge, code_verifier } = this.getChallenge();
    this.code_verifier = code_verifier;
    this.state = crypto.randomInt(281474976710655);
    const tokenRequest = this.makeTokenResolver();
    return this.startUserAuthentication(code_challenge).then(
      () => tokenRequest
    );
  }

  makeTokenResolver() {
    return new Promise(resolve => {
      this.tokenResolver = resolve;
    });
  }

  async startUserAuthentication(code_challenge) {
    const client = await this.clientPromise;
    if (!client) return Promise.reject("unable to connect to oidc provider");
    const url = client.authorizationUrl({
      scope: "openid email profile",
      code_challenge,
      state: this.state,
      code_challenge_method: "S256",
      redirect_uri: "http://127.0.0.1:5505/callback",
    });
    this.openUrl(url);
  }

  openUrl(url) {
    return open(url);
  }

  getChallenge() {
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    return { code_challenge, code_verifier };
  }

  async endUserAuthentication(req, code_verifier, state_verifier) {
    const client = await this.clientPromise;
    const { state, ...params } = client.callbackParams(req);
    if (state != state_verifier) throw "incorrect state in callback";
    return client.callback(
      "http://127.0.0.1:5505/callback",
      { ...params, scope: "openid email profile" },
      { code_verifier }
    );
  }

  getTokens() {
    return this.authenticate();
  }

  destroy() {
    this.tokenResolver({});
    return this.localServer.close();
  }
}

export { Account, AccountManager, Client, provider, service };
