#! /usr/bin/env node

const quake = require("./index.js");
const fs = require("pify")(require('fs'));
const path = require('path');
const a = require("fs").access;
const access = f => new Promise(res => a(f, err => res(!!err)));

const filesToLookFor = ["Quakefile.js", "quakefile.js", "Quakefile", "quakefile"].map(v => path.join(process.cwd(), v));
const task = process.argv[2];

Promise.all(filesToLookFor.map(access))
  .then(res => filesToLookFor[res.indexOf(true)])
  .then(function run(file) {
    global.quake = quake;
    require(file);
    delete global.quake;
    if (task) {
      quake.start(task);
    } else {
      quake.start("default");
    }
  })
  .catch(function error(err) {
    console.error("ERROR during init:", err);
    process.exit(1);
  });
