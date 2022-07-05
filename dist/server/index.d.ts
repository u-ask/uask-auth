import { Knex } from "knex";
import { Provider, AdapterConstructor } from "oidc-provider";
import { TokenSet } from "openid-client";
import { Protocol, Router } from "restana";

declare class Account {
  readonly email: string;
  readonly surveys: {[survey: string]: {samples: string[], role: string, participantIds: string[]}};
  readonly [claim: string]: unknown;
  constructor(userid: string, surveys: {[survey: string]: {samples: string[], role: string}}, args: {[k: string]: unknown});
}

declare type Notifier = (account: Account, c: { code: string; }) => Promise<void>;

declare function provider(adapter: AdapterConstructor, findAccount: (ctx: unknown, id: string) => Promise<unknown>): Provider;
declare function service(provider: Provider, client: Knex, notify?: Notifier): Router<Protocol>;
declare class AccountManager {
  constructor(client: Knex);
  findOIDCAccount(ctx: unknown, id: string): Promise<unknown>;
  getAll(): Promise<Account[]>;
  getBySurvey(survey: string): Promise<Account[]>;
  getByUserid(email: string): Promise<Account | undefined>;
  save(account: Account): Promise<void>;
}

declare class Client {
  getTokens(): Promise<TokenSet>;
  destroy(): Promise<void>;
}

export { provider, service, Account, AccountManager, Client };
