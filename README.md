# list pull requests action
Put outputs pull requests list.

## Inputs
### token
github token.

### labels
List pull requests that match the specified label.  
json array string (ex. `["WFR","ASAP"]`)

### skip_hour
Pull requests within this hour will not be listed.

## Outputs
### pulls
List pull requests string.  
format

```
Pull Request Title 1
https://github.com/buildsville/list-pull-requests/pull/1
---
Pull Request Title 2
https://github.com/buildsville/list-pull-requests/pull/2
```

## Example usage
```
name: remind review
on:
  schedule:
    - cron: '0 15 * * *'
jobs:
  send_pull_requests:
    runs-on: ubuntu-latest
    name: A job to say hello
    steps:
      - name: listPullRequests
        uses: buildsville/list-pull-requests@v1
        id: list
        with:
          token: ${{secrets.GITHUB_TOKEN}}
          labels: '["WFR"]'
          skip_hour: '24'
      - name: output
        run: echo '${{ steps.list.outputs.pulls }}'
```
