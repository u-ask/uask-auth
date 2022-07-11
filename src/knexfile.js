const config = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./db/dev.sqlite3",
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
    useNullAsDefault: true,
    log: {
      warn(message) {
        switch (message) {
          case ".returning() is not supported by sqlite3 and will not have any effect.":
            break;
          default:
            console.log(message);
        }
      },
    },
  },
};

export default config;
