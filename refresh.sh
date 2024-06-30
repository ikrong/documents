#!/bin/bash

REPO=$1
WORKFLOW=$2

function r() {
    echo -e "\033[31m$1\033[0m"
}

function g() {
    echo -e "\033[32m$1\033[0m"
}

function b() {
    echo -e "\033[34m$1\033[0m"
}

if [ -z "$REPO" ] || [ -z "$WORKFLOW" ]; then
    echo "Usage: $0 REPO WORKFLOW"
    exit 1
fi

function get_workflow() {
    cmd="gh api \
        --method GET \
        -H 'Accept: application/vnd.github+json' \
        -H 'X-GitHub-Api-Version: 2022-11-28' \
        /repos/$REPO/actions/workflows/$WORKFLOW/runs \
        -f 'per_page=1' -f 'status=in_progress' \
        --jq '.workflow_runs.[0].id'
    "
    runid=$(echo $cmd | sh)
    if [ "$runid" != "" ]; then
        echo "Workflow RunID: $runid"
        loop $runid
    else
        echo "No running workflow"
    fi
}

function loop() {
    cmd="gh api \
        --method GET \
        -H 'Accept: application/vnd.github+json' \
        -H 'X-GitHub-Api-Version: 2022-11-28' \
        /repos/$REPO/actions/runs/$1 \
        --template '{{.status}} {{.run_started_at}}'
    "
    result=($(echo $cmd | sh))
    status=${result[0]}
    time=${result[1]}
    while [ "$status" = "in_progress" ]; do
        clear
        echo "Workflow $(g $WORKFLOW) RunID: $(b $1) $(g $status) $(( ($(date "+%s")-$(date -u -jf "%Y-%m-%dT%H:%M:%SZ" "$time" "+%s")) / 60 ))min"
        echo "Open https://github.com/$REPO/actions/runs/$1 to see log"
        sleep 20
        result=($(echo $cmd | sh))
        status=${result[0]}
    done
    clear
    echo "Workflow $(g $WORKFLOW) RunID: $(b $1) $(g $status)"
    echo "Open https://github.com/$REPO/actions/runs/$1 to see log"
}

clear

get_workflow