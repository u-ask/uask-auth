# U-ASK Authentication
Authentication for [U-ASK](https://github.com/u-ask/uask#readme) system. The authentication sub-system follows [OpenId Connect](https://openid.net/connect/) standard.

This library is intended to be used with [U-ASK Management System](https://github.com/u-ask/uask-sys#readme).

# Install
```
npm install uask-auth
```

# Configuration
U-ASK auth uses [oidc provider](https://github.com/panva/node-oidc-provider) and [knex](https://knexjs.org/) to manage its underlying database. The knex adapter for oidc-provider is needed :
```
npm install oidc-provider-knex-adapter
```

The auth schema setup scripts are located in the `uask-auth` migration directory that should be added to the knex config file in the hosting project.
```js
const production = {
  // database settings...
  migrations: {
    directory: ["./node_modules/uask-auth/db/migrations", /* other dirs */],
  },
};

export {
  // other configurations...
  production
}
```

# Usage
The authentication sub-system is a middleware that can be mounted on a [express](https://github.com/expressjs/express) or [restana](https://github.com/BackendStack21/restana) based web service.

## Environment variables
The systems uses the following environment variables :

| variable          | description                                  | example 
|:------------------|:---------------------------------------------|:-------
| CALLBACK_ROOT_URL | the authorized open id callback URL          | `https://uask.example.com/callback`
| AUTH_URL          | the public URL of the authentication service | `https://uask-api.example.com:3000/oidc`
| AUTH_JWKS         | a JSON stringified JWKS                      | `{"keys":[{"crv":"P-256",...`
| SAAS_MODE         | set to false to remove sign up               | `true`

Setting AUTH_JWKS to `{}` will use a quick start development-only signing set. For more information about JWKS generation, see [this example](https://github.com/panva/node-oidc-provider-example/blob/main/01-oidc-configured/generate-keys.js).

SAAS_MODE defaults to `true`, this will allow anybody to sign up to the system. SAAS mode is required for the first start to allow the first user to sign up. This first user will be able to create more users.

## Middleware setup
The authentication middleware is setup as follows :
```ts
// oidc.ts

import Knex from "knex";
import { config } from "../knexclient.js";
import { AccountManager, provider, service } from "uask-auth";
import { knexAdapter } from "oidc-provider-knex-adapter";

// build the underlying database adapter
const client = Knex(config[process.env.NODE_ENV]);
const DbAdapter = knexAdapter(client);

// build the oidc provider
const manager = new AccountManager(client);
const findAccount = (ctx: unknown, id: string) =>
  manager.findOIDCAccount(ctx, id);
const oidc = provider(DbAdapter, findAccount);

// build the authentication service with user interactions
export const oidcService = service(oidc, manager, async (account, { code }) => {
  console.log(account.email, code);
});
```
1. The database configuration is done by building the adapter with a knex client.
1. The oidc provider needs the database adapter and a way to find user accounts. This uses an `AccountManager` instance. In our example accounts are stored in the same database as oidc tokens (the same knex client is used).
1. The auth service with user interactions needs the oidc provider, the account manager and a way to send connexion codes to users, in real life a mail sending system will be used.

## Serving the authentication service
Interactions use a static web application that must be served along with the authentication service.
```js
// app.ts

import restana from "restana";
import serveStatic from "serve-static";
import { oidcService } from "./oidc.js";

const server = restana();
server
  .use(serveStatic("node_modules/uask-auth/dist/app"))
  .use("/oidc", oidcService);
  
server.start(3000);
```

We recommend to use [helmet](https://github.com/helmetjs/helmet) in front of the authentication service. For use in Chromium based browsers, the `form-action` CSP must be amended to allow redirections to the callback URL.

```ts
const callbackHost = new URL(process.env.CALLBACK_ROOT_URL as string).host;
const contentSecurityPolicy = {
  directives: {
    "form-action": [ "'self'", callbackHost],
  },
};
server
  .use(helmet({ contentSecurityPolicy }))
```

## `AccountManager` and `Account` classes

**AccountManager**

| constructor      | description                  
|:-----------------|:-----------------------------
| `(client: Knex)` | build a new `AccountManager` 

| method                                               | returns                          | description 
|:-----------------------------------------------------|:---------------------------------|:------------
| `findOIDCAccount(ctx: unknown, id: string)`          | `Promise`            | used internally by the oidc provider to get claims 
| `getBySurvey(survey: string)`                        | `Promise<Account[]>` | get accounts that has privileges on the given survey
| `getByUserid(email: string)`                         | `Promise<Account?>`  | get the account associated to the given userid ; userids are uniques.
| `save(account: Account)`                             | `Promise<void>`      | save an account ; if the account contains the internal `id` field, it is updated otherwise it is modified as long as another account does not exist with the same userid.

**Account**

| constructor      | description                  
|:-----------------|:-----------------------------
| `(userid: string, surveys: SurveyClaims, claims: {[k: string]: unknown})` | build a new `Account` 

| property                | description
|:------------------------|:------------
| `id: string`            | the internal identifier needed for CRUD operations
| `userid: string`        | the identifier of the user the account is associated with
| `email: string`         | the email of the user
| `surveys: SurveyClaims` | the privileges granted to this account

**SurveyClaims**

A `SurveyClaims` object is a map indexed by survey names with the following values :
| property                 | description
|:-------------------------|:------------
| `role: string`           | the kind of privilege granted for the survey
| `samples: string[]`      | the samples the account has access to
| `participants: string[]` | the participants the accout has access to

For more information about roles, samples and participants see [U-ASK Domain Model](https://github.com/u-ask/uask-dom#readme) and [U-ASK Management System](https://github.com/u-ask/uask-sys#readme).