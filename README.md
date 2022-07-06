# U-ASK Authentication
Authentication for [U-ASK](https://github.com/u-ask/uask) system. The authentication sub-system follows [OpenId Connect](https://openid.net/connect/) standard.

# Install
```
npm install uask-auth
```

# Configuration
U-ASK auth uses [oidc provider](https://github.com/panva/node-oidc-provider).

U-ASK auth uses [knex](https://knexjs.org/) to manage its underlying database. The knex adapter for oidc-provider is needed :
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
  production
}
```

# Usage
The authentication sub-system is a middleware that can be mounted on a [express](https://github.com/expressjs/express] or [restana](https://github.com/BackendStack21/restana) based web service.

```js
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
export const oidcService = service(oidc, client, async (account, { code }) => {
  console.log(account.email, code);
});
```
1. The database configuration is done by building the adapter with a knex client.
1. The oidc provider needs the database adapter and a way to find user accounts. In our example accounts are stored in the same database as oidc tokens.
1. The auth service with user interactions needs the oidc provider, the account manager and a way to send connexion codes to users, in real life a mail sending system will be used.