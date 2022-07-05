import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import pkg from "./package.json";

const external = Object.keys(pkg.dependencies);

const plugins = [resolve(), json(), commonjs()];

export default [
  {
    input: {
      index: "./src/server.js",
      example: "./src/example.js",
    },
    output: {
      dir: "./dist/server",
      format: "es",
      manualChunks: {
        "index": ["src/server.js", "src/account.js"]
      }
    },
    external,
    plugins: [
      ...plugins,
      copy({
        targets: [
          { src: "src/server.d.ts", dest: "dist/server", rename: "index.d.ts" },
          { src: "src/example.d.ts", dest: "dist/server" },
        ],
      }),
    ],
  },
  {
    input: "./src/views/app.vue.js",
    output: {
      file: "./dist/app/app.vue.js",
      format: "es",
    },
    plugins: [
      copy({
        targets: [
          {
            src: "src/views/assets",
            dest: "dist/app",
          },
          {
            src: "src/views/style",
            dest: "dist/app",
          },
        ],
      }),
    ],
  },
];
