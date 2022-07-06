import restana from "restana";
import bodyParser from "body-parser";
import { Account, AccountManager, generateCode } from "./account.js";
import debug from "debug";
import {
  renderLogin,
  renderConsent,
  redirectToLogin,
  askedForCode,
  notificationNeeded,
  redirectToCodeAuthentication,
  getUserId,
  getPassword,
  isMagic,
  askedForSignUp,
  getUserName,
  getUserSurname,
  getUserOrganization,
  getUserRole,
  getUserPhone,
} from "./viewhelpers.js";
const dlog = debug("uask-auth:service");

export function service(provider, accountManager, notify = console.log) {
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

const authUrl =
  process.env.AUTH_URL ??
  `http://localhost:${process.env.AUTH_PORT ?? 3000}/oidc`;

function setHost(req, res, next) {
  const host = new URL(authUrl).host;
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
