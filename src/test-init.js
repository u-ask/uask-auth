import restana from "restana";
import { launch } from "chrome-launcher";
import puppeteer from "puppeteer-core";
import sinon from "sinon";
import { shutdown as devServerShutdown } from "./devserver.js";
import { client } from "./notification.js";
import { exampleAccounts } from "./example.js";

class TokenStealer {
  constructor() {
    this._tokens = [];
    this._initLastTokenResolver();
    this._startServer();
    sinon.stub(client, "post").callsFake((path, { json: { code } }) => {
      this._lastTokenResolver(code);
    });
  }

  _startServer() {
    this._app = restana();
    this._app.post("/token", (req, res) => this._stealToken(req, res));
    this._app.get("/callback", (req, res) => this._extractTokenPage(req, res));
    this._app.start(process.env.CLIENT_PORT ?? 8080);
  }

  _extractTokenPage(req, res) {
    res.send(
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>title</title>
          <link rel="stylesheet" href="style.css">
          <script src="script.js"></script>
        </head>
        <body>
          <script>
            const auth = window.location.hash.replace(/#code=/, "").replace(/&state.*$/, "");
            fetch("/token", {
              method: "post",
              headers: {
                "Authorization": auth
              },
            })
          </script>
        </body>
      </html>`,
      200,
      { "content-type": "text/html" }
    );
  }

  _stealToken(req) {
    const {
      headers: { authorization },
    } = req;
    this._lastTokenResolver(authorization);
  }

  _extractAuthCode(req) {
    this._lastTokenResolver(req.body.code);
  }

  _initLastTokenResolver() {
    const asynToken = new Promise(r => (this._lastTokenResolver = r)).then(
      t => {
        this._initLastTokenResolver();
        return t;
      }
    );
    this._tokens.push(asynToken);
  }

  shiftToken() {
    const tokenTimeout = new Promise((_, r) =>
      setTimeout(() => {
        r("token stealing timeout");
      }, 2000)
    );
    return Promise.race([this._tokens.shift(), tokenTimeout]);
  }

  close() {
    this._app.close();
  }
}

export let tokenStealer;
export let appClient;
let initCallCount = 0;

export async function init() {
  initCallCount++;

  if (initCallCount == 1) {
    const browserURL = "http://127.0.0.1:21222";
    tokenStealer = new TokenStealer();
    const headless = process.env.HEADLESS == "true" ? ["--headless"] : [];
    appClient = launch({ port: 21222, chromeFlags: [...headless] }).then(
      async chrome => {
        const browser = await puppeteer.connect({ browserURL });
        return { chrome, browser };
      }
    );
  }
  return appClient;
}

export async function seed(dbClient) {
  await dbClient.table("accounts").del();
  await dbClient.table("accounts").insert(exampleAccounts.map(u => {
    return {
      id: u.id,
      email: u.email,
      email_verified: u.email_verified,
      given_name: u.given_name,
      password: u.password,
      surname: u.surname,
      salt: u.salt,
      title: u.title,
      phone: u.phone,
      surveys: JSON.stringify(u.surveys),
      userid: u.email
    };
  }));
}

export async function shutdown() {
  initCallCount--;
  if (initCallCount == 0) {
    const { chrome, browser } = await appClient;
    chrome.kill().then(() => browser.close()).catch(() => {});
    tokenStealer.close();
    await devServerShutdown();
  }
}
