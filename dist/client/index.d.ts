import { TokenSet } from "openid-client";

declare class Client {
  constructor(url?: string);
  getTokens(): Promise<TokenSet>;
  destroy(): Promise<void>;
}

export { Client }
