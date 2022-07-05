import Provider from "oidc-provider";
import logout from "./views/logout.js";

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

const jwks = process.env.AUTH_JWKS

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

export function provider(adapter, findAccount) {
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

export function interactionUrl(ctx, interaction) {
  return `/oidc/interaction/${interaction.uid}?method=${
    ctx.query.method ?? "password"
  }${ctx.query.userid ? `&userid=${ctx.query.userid}` : ""}${
    ctx.query.magic ? `&magic=${ctx.query.magic}` : ""
  }${ctx.query.userid ? `&name=${ctx.query.name}` : ""}${
    ctx.query.surname ? `&surname=${ctx.query.surname}` : ""
  }${ctx.query.organization ? `&organization=${ctx.query.organization}` : ""}${ctx.query.role ? `&role=${ctx.query.role}` : ""}${ctx.query.phone ? `&phone=${ctx.query.phone}` : ""}`;
}
