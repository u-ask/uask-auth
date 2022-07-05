import test from "tape";
import { Account, AccountManager, generateCode } from "./account.js";
import knex from "knex";
import config from "./knexfile.js";
import { exampleAccounts } from "./example.js";

const client = knex(config[process.env.APP_ENV ?? "development"]);

test.onFinish(() => client.destroy());

const exampleAccount0 = exampleAccounts.find(
  u => u.userid == "investigator001@example.com"
);
const manager = new AccountManager(client);

test("Save an account in knex database", async t => {
  await client.table("accounts").del();
  await manager.save(
    new Account(
      "investigator001@example.com",
      { "P11-05": { samples: ["001"], role: "investigator" } },
      {
        ...exampleAccount0,
        password: "passw0rd",
      }
    )
  );
  const { salt: salt0, password: password0, ...result0 } = await client
    .table("accounts")
    .where({ userid: "investigator001@example.com" })
    .select(["id", "email", "given_name", "surname", "salt", "password"])
    .then(r => r[0]);
  const expectedResult0 = {
    id: "c2ac2b4a-2262-4e2f-847a-a40dd3c4dcd5",
    email: "investigator001@example.com",
    given_name: "Henriette",
    surname: "Monsseau",
  };
  t.deepLooseEqual(result0, expectedResult0);
  t.notEqual(password0, "passw0rd");
  t.true(salt0.length);
  t.end();
});

test("Update an account in knex database", async t => {
  await client.table("accounts").del();
  await manager.save(
    new Account("investigator001@example.com", "P11-05", {
      ...exampleAccount0,
      password: "passw0rd",
    })
  );
  const { salt: salt0, password: password0 } = await client
    .table("accounts")
    .where({ userid: "investigator001@example.com" })
    .select(["salt", "password"])
    .then(r => r[0]);
  await manager.save(
    new Account("investigator001@example.com", "P11-05", {
      given_name: "Volt",
      id: exampleAccount0.id,
      userid: exampleAccount0.userid,
    })
  );
  const { salt: salt1, password: password1, ...result1 } = await client
    .table("accounts")
    .where({ userid: "investigator001@example.com" })
    .select(["id", "userid", "given_name", "surname", "salt", "password"])
    .then(r => r[0]);
  t.equal(result1.id, exampleAccount0.id);
  t.equal(result1.given_name, "Volt");
  t.equal(result1.userid, exampleAccount0.userid);
  t.equal(salt1, salt0);
  t.equal(password1, password0);
  t.end();
});

test("find an account", async t => {
  await client.table("accounts").del();
  await manager.save(exampleAccount0);
  const id = "c2ac2b4a-2262-4e2f-847a-a40dd3c4dcd5";
  const account = await manager.findOIDCAccount(undefined, id);
  const claims = await account.claims();
  t.equal(claims.sub, exampleAccount0.id);
  t.equal(claims.userid, exampleAccount0.userid);
  t.equal(claims.email, exampleAccount0.email);
  t.deepLooseEqual(claims.surveys, exampleAccount0.surveys);
  t.end();
});

test("Authentication failure", async t => {
  await client.table("accounts").del();
  await manager.save(
    new Account(
      "investigator001@example.com",
      { "P11-05": { samples: ["001"], role: "investigator" } },
      {
        ...exampleAccount0,
        password: "passw0rd",
      }
    )
  );
  const email = "investigator001@example.com";
  const id = await manager.authenticate({ email, password: "passw0rd!" });
  t.false(id);
  t.end();
});

test("Authentication success", async t => {
  await client.table("accounts").del();
  await manager.save(
    new Account(
      "investigator001@example.com",
      { "P11-05": { samples: ["001"], role: "investigator" } },
      {
        ...exampleAccount0,
        password: "passw0rd",
        userid: "investigator001@example.com",
      }
    )
  );
  const email = "investigator001@example.com";
  const id = await manager.authenticate({
    method: "password",
    email,
    password: "passw0rd",
  });
  t.equal(id, "c2ac2b4a-2262-4e2f-847a-a40dd3c4dcd5");
  t.end();
});

test("Authentication with role", async t => {
  await client.table("accounts").del();
  await manager.save(
    new Account(
      "investigator_sample_001",
      { "P11-05": { samples: ["001"], role: "participant" } },
      {
        ...exampleAccount0,
        userid: "investigator_sample_001",
      }
    )
  );
  const role = "investigator_sample_001";
  const id = await manager.authenticate({ method: "demo", role });
  t.equal(id, exampleAccount0.id);
  t.end();
});

test("Authentication with temporary code", async t => {
  await client.table("accounts").del();
  await manager.save(
    new Account(
      "investigator001@example.com",
      { "P11-05": { samples: ["001"], role: "participant" } },
      {
        ...exampleAccount0,
        email: "investigator001@example.com",
      }
    )
  );
  const userid = "investigator001@example.com";
  const code = await generateCode({ userid });
  const id = await manager.authenticate({ method: "code", userid, code });
  t.ok(id);
  t.end();
});

test("Authentication with temporary code fails at fourth attempt", async t => {
  await client.table("accounts").del();
  const userid = "investigator_sample_001";
  const code = await generateCode({ userid });
  const id3 = await manager.authenticate({
    method: "code",
    userid,
    code: "3342",
  });
  t.notOk(id3);
  const id2 = await manager.authenticate({
    method: "code",
    userid,
    code: "3342",
  });
  t.notOk(id2);
  const id1 = await manager.authenticate({
    method: "code",
    userid,
    code: "3342",
  });
  t.notOk(id1);
  const id0 = await manager.authenticate({ method: "code", userid, code });
  t.notOk(id0);
  t.end();
});

test("Find accounts by survey", async t => {
  await client.table("accounts").del();
  await manager.save(exampleAccount0);
  const accounts = await new AccountManager(client).getBySurvey("P11-05");
  t.equal(accounts.length, 1);
  t.equal(accounts[0].id, exampleAccount0.id);
  t.end();
});

test("Find account by email", async t => {
  await client.table("accounts").del();
  await manager.save(exampleAccount0);
  const account = await new AccountManager(client).getByUserid(
    "investigator001@example.com"
  );
  t.true(account);
  t.equal(account.id, exampleAccount0.id);
  t.end();
});

test("Generate random temporary codes", async t => {
  await client.table("accounts").del();
  const userid = "investigator001@example.com";
  const code = await generateCode({ userid });
  t.equal(code.length, 6);
  t.notEqual(await generateCode({ userid }), code);
  t.end();
});

test("Create same account twice", async t => {
  await client.table("accounts").del();
  const account = new Account(
    "investigator_sample_001",
    { "P11-05": { samples: ["001"], role: "participant" } },
    {
      ...exampleAccount0,
      id: undefined,
    }
  );
  await manager.save(account);
  const account2 = new Account(
    "investigator_sample_001",
    { "P11-05": { samples: ["001"], role: "participant" } },
    {
      ...exampleAccount0,
      id: undefined,
    }
  );
  await manager
    .save(account2)
    .then(() => t.fail())
    .catch(e => {
      t.equal(e, "Account investigator_sample_001 already exists");
    });
  t.end();
});

test("Get all accounts", async t => {
  await client.table("accounts").del();
  for (const a of exampleAccounts)
    await manager.save(a);
  const accounts = await manager.getAll();
  t.deepEqual(accounts.map(a => a.userid), exampleAccounts.map(a => a.userid));
  t.end();
});
