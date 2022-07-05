import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import pkg from "./package.json"

const external = Object.keys(pkg.dependencies);

const plugins = [
  resolve(),
  json(),
  commonjs(),
];

export default {
  input: "./src/client.js",
  output: [{
    file: "./dist/client/index.js",
    format: "es",
  }],
  external,
  plugins: [
    ...plugins,
      copy({
        targets: [
          { src: "src/client.d.ts", dest: "dist/client", rename: "index.d.ts" },
        ],
      }),
  ],
};
