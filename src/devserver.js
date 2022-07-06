import restana from "restana";
import knex from "knex";
import config from "./knexfile.js";
import { service } from "./interaction.js";
import { provider } from "./provider.js"
import { knexAdapter } from "oidc-provider-knex-adapter";
import { AccountManager } from "./account.js";
import { notify } from "./notification.js";
import bodyParser from "body-parser";
import serveStatic from "serve-static";

const dbClient = knex(config[process.env.APP_ENV]);
const DbAdapter = knexAdapter(dbClient);
const manager = new AccountManager(dbClient);
const findAccount = (ctx, id) => manager.findOIDCAccount(ctx, id);
const oidc = provider(DbAdapter, findAccount)

export const server = restana();
const appRoot = process.env.AUTH_APP_PATH ?? "src/views";
server.use("/", serveStatic(appRoot))
server.use("/oidc", service(oidc, manager, notify));
server.use(bodyParser.json());
server.post("/notification/authent/code", (req, res) => {
  console.log(req.body);
  res.send(200);
});
const callbackRoot = process.env.CALLBACK_ROOT_URL ?? `http://localhost:${process.env.CLIENT_PORT ?? 8080}/callback`;
export const implicitFlowTestUrl = `http://localhost:${process.env.AUTH_PORT ?? 3000}/oidc/auth?client_id=uask-test&response_type=id_token&scope=openid+email+profile&redirect_uri=${callbackRoot}&state=111&nonce=222`;
console.log("env      : ", process.env.APP_ENV);
console.log("app root : ", appRoot);
console.log("callback : ", callbackRoot)
console.log("test URL : ", implicitFlowTestUrl)
server.start(process.env.AUTH_PORT ?? 3000);

export async function shutdown() {
  await DbAdapter.destroy();
  await dbClient.destroy();
  await server.close();
}