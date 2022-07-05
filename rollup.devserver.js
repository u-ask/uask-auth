import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import generatePackageJson from "rollup-plugin-generate-package-json";
import json from "@rollup/plugin-json";

import pkg from "./package.json"

const external = Object.keys(pkg.dependencies);

const plugins = [
  resolve(),
  json(),
  commonjs(),
];

export default {
  input: "./src/devserver.js",
  output: {
    file: "./out/devserver.js",
    format: "es",
  },
  external,
  plugins: [
    ...plugins,
    generatePackageJson({
      outputFolder: "dist/uask-auth",
      baseContents: pkg => ({
        name: pkg.name,
        version: pkg.version,
        type: "module"
      }),
    }),
  ],
};
