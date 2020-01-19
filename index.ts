import * as core from '@actions/core'
import * as github from '@actions/github'
import Octokit = require('@octokit/rest')

const token: string = core.getInput('token')
const labels: string[] = JSON.parse(core.getInput('labels'))
const repoOwner: string = github.context.repo.owner
const repo: string = github.context.repo.repo

function pullRequests(repoOwner:string, repo:string ):Promise<Octokit.Response<Octokit.PullsListResponse>> {
    let pr = new github.GitHub(token)
    let resp = pr.pulls.list({
        owner: repoOwner,
        repo: repo,
    }).catch(
        e => {
            console.log(e.message)
        }
    ) as Promise<Octokit.Response<Octokit.PullsListResponse>>
    return resp
}

function filterLabel(labels: Octokit.PullsListResponseItemLabelsItem[],target: string[]):boolean{
    let labelname = labels.map((label) => {
        return label.name
    })
    let filterdLabels = labelname.filter(
        label => target.indexOf(label) != -1
    )
    if ( filterdLabels.length == target.length) {
        return true
    } else {
        return false
    }
}

function setOutput(pull:Octokit.PullsListResponseItem[]){
    let output = ''
    for (const p of pull) {
        output = output + p.title + "\\n" + p.html_url + "\\n---\\n"
    }
    output = output.slice(0,-7) //最後の"\\n---\\n"を削除
    core.setOutput('pulls', output)
}

let prom = pullRequests(repoOwner,repo)
prom.then((pulls) => {
    let claim = pulls.data.filter(
        p => filterLabel(p.labels, labels)
    )
    setOutput(claim)
})
