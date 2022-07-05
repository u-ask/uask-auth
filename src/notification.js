import got from "got";

const prefixUrl =
  process.env.NOTIFY_URL ??
  `http://localhost:${process.env.AUTH_PORT ?? 3000}/notification`;

export const client = got.extend({ prefixUrl });

export function notify(account, { userid, code }) {
  return client.post("authent/code", {
    json: {
      userid: account?.userid ?? userid,
      code,
    },
  });
}
