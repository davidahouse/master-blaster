#!/usr/bin/env node
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const WebSocket = require("ws");

var pkginfo = require("pkginfo")(module);
const conf = require("rc")("master-blaster", {
  // defaults
  port: 7777,
  logLevel: "debug"
});

clear();
console.log(
  chalk.green(figlet.textSync("master-blaster", { horizontalLayout: "full" }))
);
console.log(chalk.green(module.exports.version));

const wss = new WebSocket.Server({ port: conf.port });
console.log(chalk.green("Awaiting connections on " + conf.port));

wss.on("connection", function connection(ws) {
  console.log(chalk.yellow("Client connected!"));
  ws.on("message", function incoming(data) {
    if (conf.logLevel === "debug") {
      console.log(chalk.green(data));
    }
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
