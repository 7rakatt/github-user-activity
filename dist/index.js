#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const prog = new commander_1.Command();
function fetchgithubactivity(userName) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://api.github.com/users/${userName}/events`, {
            headers: {
                "User-Agent": "node.js",
            },
        });
        if (!res.ok) {
            if (res.status === 404) {
                console.log(new Error("User not found. Please check the username."));
            }
            else {
                console.log(new Error(`Error fetching data: ${res.status}`));
            }
        }
        return res.json();
    });
}
function displayActivity(events) {
    if (events.length === 0) {
        console.log("No recent activity found.");
        return;
    }
    events.forEach((event) => {
        let action;
        switch (event.type) {
            case "PushEvent":
                const commitCount = event.payload.commits.length;
                action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
                break;
            case "IssuesEvent":
                action = `${event.payload.action.charAt(0).toUpperCase() +
                    event.payload.action.slice(1)} an issue in ${event.repo.name}`;
                break;
            case "WatchEvent":
                action = `Starred ${event.repo.name}`;
                break;
            case "ForkEvent":
                action = `Forked ${event.repo.name}`;
                break;
            case "CreateEvent":
                action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
                break;
            default:
                action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
                break;
        }
        console.log(`- ${action}`);
    });
}
prog
    .name("github-user-activity")
    .description("cli tool to get github user activity")
    .version("1.0.0");
prog.argument("<userName>", "user name").action((userName) => {
    fetchgithubactivity(userName)
        .then((events) => {
        displayActivity(events);
    })
        .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
});
prog.parse(process.argv);
//# sourceMappingURL=index.js.map