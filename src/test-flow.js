import { implicitFlowTestUrl } from "./devserver.js";
import jwtDecode from "jwt-decode";
import { appClient, tokenStealer } from "./test-init.js";

const logoutTestUrl = implicitFlowTestUrl.replace(
  /auth.*$/,
  "session/end"
);

export async function testAlert(t, page, message) {
  const alert = await page.waitForSelector("p.alert-message", { timeout: 10000 });
  const text = await page.evaluate(el => el.textContent.replace("&#39;", "'"), alert);
  t.equal(text, message);
}

export function testSignin(t, token) {
  t.ok(token);
  const decoded = jwtDecode(token);
  t.ok(decoded.sub);
  t.equal(decoded.userid, "administrator@example.com");
}

export function testSignup(t, token) {
  t.ok(token);
  const decoded = jwtDecode(token);
  t.ok(decoded.sub);
  t.equal(decoded.userid, "test.signup@example.com");
  t.equal(decoded.given_name, "Jean");
  t.equal(decoded.surname, "Dupont");
  t.equal(decoded.phone, "0607080910")
  t.deepEquals(decoded.extra_infos, { organization: "Arone", role: "Developer" });
}

export async function testSignout(t, page) {
  const title = await page.waitForSelector("h1", { timeout: 10000 });
  const text = await page.evaluate(el => el.textContent, title);
  t.equal(text, "Sign-out Success");
}

export async function startImplicitFlow() {
  const { browser } = await appClient;
  const page = await browser.newPage();
  await Promise.all([page.waitForNavigation(), page.goto(implicitFlowTestUrl)]);
  await typeEmail(page);
  return page;
}

export async function startSignupFlow() {
  const { browser } = await appClient;
  const page = await browser.newPage();
  await Promise.all([page.waitForNavigation(), page.goto(implicitFlowTestUrl)]);
  const signupLink = await page.waitForSelector("ul>li>a#signupLink", { timeout: 10000 });
  await signupLink.click();
  return page;
}

export async function startImplicitFlowAfterSignup() {
  const { browser } = await appClient;
  const page = await browser.newPage();
  await Promise.all([page.waitForNavigation(), page.goto(implicitFlowTestUrl)]);
  await typeSignupEmail(page);
  return page;
}

export async function typeSignupEmail(page) {
  const email = await page.waitForSelector("input[type=email][name=email]", {
    timeout: 10000,
  });
  await email.type("test.signup@example.com");
}

export async function typeSignupInfos(page) {
  await typeSignupEmail(page)
  const name = await page.waitForSelector("input[type=text][name=name]", {
    timeout: 10000,
  });
  await name.type("Jean");
  const surname = await page.waitForSelector("input[type=text][name=surname]", {
    timeout: 10000,
  })
  await surname.type("Dupont");
  const organization = await page.waitForSelector("input[type=text][name=organization]", {
    timeout: 10000,
  })
  await organization.type("Arone");
  const role = await page.waitForSelector("input[type=text][name=role]", {
    timeout: 10000,
  })
  await role.type("Developer");
  const phone = await page.waitForSelector("input[type=text][name=phone]", {
    timeout: 10000,
  })
  await phone.type("0607080910");
}

export async function validateSignup(page) {
  const validateSignup = await page.waitForSelector("#signup-code", { timeout: 10000 });
  await Promise.all([page.waitForNavigation(), validateSignup.click()]);
  return await tokenStealer.shiftToken();
}

export async function typeEmail(page) {
  const email = await page.waitForSelector("input[type=email][name=email]", {
    timeout: 10000,
  });
  await email.type("administrator@example.com");
}

export async function typePassword(page, pwd, name = "password") {
  const password = await page.waitForSelector(
    `input[type=password][name=${name}]`,
    { timeout: 10000 }
  );
  await password.type(pwd);
}

export async function signinTry(page) {
  const signin = await page.waitForSelector("#signin", { timeout: 10000 });
  await Promise.all([page.waitForNavigation(), signin.click()]);
}

export async function signin(page) {
  await signinTry(page);
  return await tokenStealer.shiftToken();
}

export async function continueWithCodeAuthentication(page) {
  const sendcode = await page.waitForSelector("#sendcode", { timeout: 10000 });
  await Promise.all([page.waitForNavigation(), sendcode.click()]);
  return await tokenStealer.shiftToken();
}

export async function typeCode(page, code) {
  const input = await page.waitForSelector("input[type=text][name=code]", {
    timeout: 10000,
  });
  await input.type(code);
}

export async function changePassword(page, pwd, pwd2) {
  await checkChangePassword(page);
  await typePassword(page, pwd);
  await typePassword(page, pwd2, "password2");
}

async function checkChangePassword(page) {
  const changePassword = await page.waitForSelector(
    "input[type=checkbox][name=changePassword]",
    { timeout: 10000 }
  );
  await changePassword.click();
}

export async function signout(page, token) {
  await Promise.all([
    page.waitForNavigation(),
    page.goto(`${logoutTestUrl}?id_token_hint=${token}`),
  ]);
  const logout = await page.waitForSelector("#logout", { timeout: 10000 });
  await Promise.all([page.waitForNavigation(), logout.click()]);
}
