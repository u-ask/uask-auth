const { Issuer } = require("openid-client");
const { Client } = require("./dist/uask-auth-client");

const client = new Client();
client
  .getTokens()
  .then(async s => {
    const info = await getInfo(s);
    console.dir(info);
    console.dir({ access_token: s.access_token });
  })
  .finally(() => client.destroy());

async function getInfo(t) {
  const iss = await Issuer.discover(
    process.env.AUTH_URL ??
      `http://localhost:${process.env.AUTH_PORT ?? 3000}/oidc`
  );
  const client = new iss.Client({
    client_id: "uaskClient",
    response_types: ["code"],
    token_endpoint_auth_method: "none",
  });
  return client.userinfo(t.access_token);
}
