require("@babel/register")({
  presets: ["@babel/preset-env"],
  configFile: false
});
require("@babel/polyfill");
require("dotenv").config();
