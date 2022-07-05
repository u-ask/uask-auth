import assert from "assert";
import crypto from "crypto";
import { Stealer } from "stealer";
import uuid from "uuid-random";

export class Account {
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

export class AccountManager {
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

export async function generateCode({ userid, name, surname, organization, role, phone }) {
  const code = await randomCode(userid);
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
