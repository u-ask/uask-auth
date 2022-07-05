import { Issuer, generators } from 'openid-client';
import restana from 'restana';
import open from 'open';
import crypto from 'crypto';

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

export { Client };
