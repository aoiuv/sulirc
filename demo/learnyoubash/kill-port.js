#!/usr/bin/env node

"use strict";

const minimist = require("minimist");
const exec = require("child_process").exec;
const args = minimist(process.argv.slice(2), {
  string: ["_", "port", "p"],
  boolean: ["help", "h"],
  alias: {
    port: "p",
    help: "h"
  }
});
const regexNodePort = /(?<=\w+[^\d]+)\d+(?=\s)/g;

const getNodeAppPidbyPort = port => {
  const execFn = (resolve, reject) => {
    exec(`lsof -i tcp:${port}`, (err, data) => {
      if (err) {
        reject(err);
      }
      const result = data.match(regexNodePort);
      result == null ? reject(result) : resolve(result[0]);
    });
  };
  return new Promise(execFn);
};

const killPID = PID => {
  const killFn = (resolve, reject) => {
    exec(`kill -9 ${PID}`, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  };
  return new Promise(killFn);
};

const getArgsPorts = () => {
  const mixPorts = Array.isArray(args.port) ? args.port.join(",") : args.ports;
  const argsPorts = (args._ || [])
    .map(p => p.split(","))
    .reduce((a, c) => {
      a = a.concat(c);
      return a;
    }, [])
    .concat((mixPorts || "").split(","))
    .filter(Boolean);
  const ports = argsPorts.filter((p, i) => argsPorts.indexOf(p) === i);
  return ports;
};

if (args.help) {
  console.log("Usage:");
  console.log("  k-port -h --help // print help information");
  console.log("  k-port 8001 // kill single port 8001");
  console.log("  k-port 8001,8002 // kill multiple ports 8001, 8002");
  console.log("  k-port -p=8001 // kill single port 8001");
  console.log("  k-port -p=8001,8002 // kill multiple ports 8001, 8002");
  console.log("  k-port --port=8001 // kill single port 8001");
  console.log("  k-port --port=8001,8002 // kill multiple ports 8001, 8002");
  console.log(
    "  k-port --port=3002 -p=3000,3001 3003 // kill multiple ports 3003, 3000, 3001, 3002"
  );
  process.exit(0);
}

(async () => {
  const ports = getArgsPorts();
  if (ports.length === 0) {
    return;
  }
  console.log("total ports:", ports, "\n");
  for (let i = 0; i < ports.length; i++) {
    let PID;
    const port = ports[i];
    try {
      PID = await getNodeAppPidbyPort(port);
      console.log(`get PID ${PID} by port: ${port}`);
      await killPID(PID);
      console.log(`kill PID ${PID} ok.`);
    } catch (err) {
      console.error(`exec failed. Error: ${err.message}`);
    }
  }
})();
