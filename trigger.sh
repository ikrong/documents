#!/bin/bash

REPO=$1
BRANCH=$2
WORKFLOW=$3

INPUTS=(${@:4})

params="-f \"ref=$BRANCH\" "

function r() {
    echo -e "\033[31m$1\033[0m"
}

function g() {
    echo -e "\033[32m$1\033[0m"
}

function b() {
    echo -e "\033[34m$1\033[0m"
}

for INPUT in "${INPUTS[@]}"
do
    KEY=$(echo $INPUT | cut -d '=' -f 1)
    VALUE=$(echo $INPUT | cut -d '=' -f 2)
    params="$params -f \"inputs[$KEY]=$VALUE\" "
done

if [ -z "$REPO" ] || [ -z "$BRANCH" ] || [ -z "$WORKFLOW" ]; then
    echo "Usage: $0 REPO BRANCH WORKFLOW INPUTS"
    exit 1
fi

gh auth status -h github.com >> /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo
    echo $(r "Need login first, you can run with following command:")
    echo
    echo $(b "gh auth login")
    echo
    exit 1
fi

clear

function trigger() {
    echo "gh api \
        --method POST \
        -H \"Accept: application/vnd.github.v3+json\" \
        -H \"X-GitHub-Api-Version: 2022-11-28\" \
        /repos/$REPO/actions/workflows/$WORKFLOW/dispatches \
        $params
    " | sh
    
    if [ $? -ne 0 ]; then
        echo $(r "Failed to trigger workflow")
        exit 1 
    else
        echo $(g "Workflow Triggered")
    fi
}

echo
if [ "$4" != "" ]; then
    echo "Triggering workflow $(r $WORKFLOW) on repository $(r $REPO) with branch $(r $BRANCH) and providing the following inputs:"
    echo
    echo "$(g $(echo "${INPUTS[@]}" | tr ' ' ',  '))"
else
    echo "Triggering workflow $(r $WORKFLOW) on repository $(r $REPO) with branch $(r $BRANCH):"
fi
echo
read -p "Confirm? [Y/n] "
echo
if [[ $REPLY =~ ^[Yy]$ ]] || [ -z $REPLY ]; then
    trigger
    sleep 20
    ./refresh.sh $REPO $WORKFLOW
fi
