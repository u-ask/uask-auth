require("@babel/register")({
  presets: ["@babel/preset-env"],
  configFile: false
});
require("@babel/polyfill");
require("dotenv").config();

const test = require("tape");

let tests = 0;
let fail = 0;

test
  .createStream({ objectMode: true })
  .on("data", r => {
    tests += 1;
    if (r.type == "assert" && !r.ok) {
      const { file, name, actual, expected, operator } = r;
      console.dir({
        file,
        name,
        operator,
        expected,
        ...(actual != undefined ? { actual } : {}),
      });
      fail += 1;
    }
  })
  .on("end", () => {
    console.dir({failed: fail, passed: tests - fail, total: tests});
  });