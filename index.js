"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github = require("@actions/github");
const token = core.getInput('token');
const labels = JSON.parse(core.getInput('labels'));
const skipSec = parseInt(core.getInput('skip_hour')) * 60 * 60;
const repoOwner = github.context.repo.owner;
const repo = github.context.repo.repo;
function pullRequests(repoOwner, repo) {
    let client = github.getOctokit(core.getInput('token'));
    let resp = client.rest.pulls.list({
        owner: repoOwner,
        repo: repo,
    }).catch(e => {
        core.setFailed(e.message);
    });
    return resp;
}
function filterLabel(labels, target) {
    let labelname = labels.map((label) => {
        return label.name;
    });
    let filterdLabels = labelname.filter(label => target.indexOf(label) != -1);
    if (filterdLabels.length == target.length) {
        return true;
    }
    else {
        return false;
    }
}
function filterTime(pull, target) {
    const createdAt = Date.parse(pull.created_at);
    const gapSec = Math.round((target - createdAt) / 1000);
    if (gapSec > skipSec) {
        return true;
    }
    return false;
}
function setOutput(pull) {
    let output = '';
    for (const p of pull) {
        output = output + p.title + "\\n" + p.html_url + "\\n---\\n";
    }
    output = output.slice(0, -7); //最後の"\\n---\\n"を削除
    core.setOutput('pulls', output);
}
const now = Date.now();
const prom = pullRequests(repoOwner, repo);
prom.then((pulls) => {
    let claim = pulls.data.filter(p => filterLabel(p.labels, labels) && filterTime(p, now));
    setOutput(claim);
});
