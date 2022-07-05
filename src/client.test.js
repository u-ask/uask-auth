import test from "tape";
import sinon from "sinon";
import { shutdown, init } from "./test-init.js";
import {
  signinTry,
  continueWithCodeAuthentication,
  typeCode,
  typeEmail,
  signout,
  testSignout,
} from "./test-flow.js";
import { Client } from "./client.js";

import knex from "knex";
import config from "./knexfile.js";
const dbClient = knex(config[process.env.APP_ENV ?? "development"]);

const appClient = init();

test.onFinish(async () => {
  shutdown();
  dbClient.destroy();
});

if (process.env.SKIP_SELENIUM_TESTS != "true") {
  test("PKCE", async t => {
    await dbClient.seed.run();
    const { browser } = await appClient;
    const page = await browser.newPage();
    const client = new Client();
    const openUrlStub = sinon
      .stub(client, "openUrl")
      .callsFake(url =>
        Promise.all([page.waitForNavigation(), page.goto(url)])
      );

    const tokenPromise = client.getTokens();
    await authenticate(page);
    const tokenSet = await tokenPromise;
    const { id_token, access_token } = tokenSet;
    const oidc = await client.clientPromise;
    const info = await oidc.userinfo(access_token);
    t.equal(info.userid, "administrator@example.com");
    await signout(page, id_token);
    await testSignout(t, page);
    await page.close();
    openUrlStub.restore();
    client.destroy();
    t.end();
  });
}

async function authenticate(page) {
  await typeEmail(page);
  const code = await continueWithCodeAuthentication(page);
  await typeCode(page, code);
  await signinTry(page);
}
