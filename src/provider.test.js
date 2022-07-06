import test from "tape";
import { shutdown, init, seed } from "./test-init.js";
import {
  startImplicitFlow,
  typePassword,
  signinTry,
  testAlert,
  continueWithCodeAuthentication,
  typeCode,
  signin,
  testSignin,
  signout,
  testSignout,
  changePassword,
  typeSignupInfos,
  startSignupFlow,
  validateSignup,
  testSignup,
  startImplicitFlowAfterSignup
} from "./test-flow.js";

import knex from "knex";
import config from "./knexfile.js";
const client = knex(config[process.env.APP_ENV ?? "development"]);

init().catch(e => console.error(e));

test.onFinish(async () => {
  shutdown();
  client.destroy();
});

if (process.env.SKIP_SELENIUM_TESTS != "true") {
  test("Implicit flow with invalid password", async t => {
    await seed(client);
    const page = await startImplicitFlow();
    await typePassword(page, "wrong_password");
    await signinTry(page);
    await testAlert(t, page, "Invalid email or password");
    await page.close();
    t.end();
  });

  test("Implicit flow with invalid code", async t => {
    await seed(client);
    const page = await startImplicitFlow();
    await continueWithCodeAuthentication(page);
    const input = await page.waitForSelector("input[type=text][name=code]", {
      timeout: 10000,
    });
    await input.type("1234");
    await signinTry(page);
    await testAlert(t, page, "Invalid code");
    await page.close();
    t.end();
  });

  test("Implicit flow with valid code", async t => {
    await seed(client);
    const page = await startImplicitFlow();
    const code = await continueWithCodeAuthentication(page);
    await typeCode(page, code);
    const token = await signin(page);
    testSignin(t, token);
    await signout(page, token);
    await testSignout(t, page);
    await page.close();
    t.end();
  });

  test("Implicit flow with paswword change failure", async t => {
    await seed(client);
    const page = await startImplicitFlow();
    const code = await continueWithCodeAuthentication(page);
    await typeCode(page, code);
    await changePassword(page, "new_password", "password_dont_match");
    await signinTry(page);
    await testAlert(t, page, "Passwords don't match");
    await page.close();
    t.end();
  });

  test("Implicit flow with paswword change success", async t => {
    await seed(client);
    const page = await startImplicitFlow();
    const code = await continueWithCodeAuthentication(page);
    await typeCode(page, code);
    await changePassword(page, "new_password", "new_password");
    const token = await signin(page);
    await signout(page, token);
    await page.close();
    const page1 = await startImplicitFlow();
    await typePassword(page1, "new_password");
    const token1 = await signin(page1);
    testSignin(t, token1);
    await signout(page1, token1);
    await page1.close();
    t.end();
  });

  test("Sign up without password change", async t => {
    await seed(client);
    const page = await startSignupFlow();
    await typeSignupInfos(page);
    const code = await validateSignup(page);
    await typeCode(page, code);
    const token = await signin(page);
    testSignup(t, token)
    await signout(page, token);
    await page.close();
    t.end();
  });

  test("Signup with password setting", async t => {
    await seed(client);
    const page = await startSignupFlow();
    await typeSignupInfos(page);
    const code = await validateSignup(page);
    await typeCode(page, code);
    await changePassword(page, "new_password", "new_password");
    const token = await signin(page);
    await signout(page, token);
    await page.close();
    const page1 = await startImplicitFlowAfterSignup();
    await typePassword(page1, "new_password");
    const token1 = await signin(page1);
    testSignup(t, token1);
    await signout(page1, token1);
    await page1.close();
    t.end();
  });
}
