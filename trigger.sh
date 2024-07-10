#!/bin/bash

SCRIPT_DIR=`dirname $0`
cd $SCRIPT_DIR

clear

OLDIFS="$IFS"

CMD=
WORKFLOWS=(`ls ./.github/workflows | grep -v -G "^_.*\.yml"`)
REPO=
BRANCH=
WORKFLOW=
WORKFLOW_NAME=
RUN_ID=
RUN_NUMBER=
INPUTS=
EXTRAS=

function r() {
    echo -e "\033[31m$1\033[0m"
}

function g() {
    echo -e "\033[32m$1\033[0m"
}

function b() {
    echo -e "\033[34m$1\033[0m"
}

function move_cursor() {
    local line=${1:-1}
    local code=""
    local i=
    for ((i=0; i<$line; i++)); do
        code="$code\033[1A\033[2K"
    done
    echo -en "$code\033[1A"
}

function check_env() {
    command -v git >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo
        echo $(r "You need to install git tool.")
        echo
    fi
    command -v gh > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo
        echo $(r "You need to install github cli tool.")
        echo $(r "Run with following command to install: ")
        echo
        echo $(g "curl -sS https://webi.sh/gh | sh")
        echo
        echo $(g "Visit https://github.com/cli/cli?#installation for more install instructions.")
        echo
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
}

function select_option() {
    local OLDIFS="$IFS"
    IFS="|"
    local description=$1
    local options=($2)
    local selected=0
    local option_length=${#options[@]}
    local view_index=0
    local show_options
    local printed=0
    local printTimes=0

    function get_visible_options() {
        IFS="|"
        if [ $option_length -lt 8 ]; then
            show_options="${options[*]}"
        else
            local new_options
            local last_index=$((selected + 6))
            local tmp
            view_index=0
            
            if [ $last_index -gt $((option_length - 1)) ]; then
                last_index=$((option_length - 1))
            fi
            tmp="${options[*]:$selected:6}"
            new_options=($tmp)
            local i=$((selected - 1))
            while [[ ${#new_options[@]} -lt 6 ]]; do
                unset tmp
                tmp="${options[$i]}|${new_options[*]}"
                unset new_options
                new_options=($tmp)
                i=$((i-1))
                view_index=$((view_index + 1))
            done
            show_options="${new_options[*]}"
        fi
    }

    function show_select() {
        IFS="|"
        get_visible_options
        local ops=($show_options)
        if [ "$printed" -eq 1 ]; then
            local ops_length=${#ops[@]}
            move_cursor $((ops_length+1))
        else
            printed=1
        fi
        echo -e "$description ( chosen \033[1;32m${options[$selected]}\033[0m )"
        local i=0
        for option in "${ops[@]}"; do
            if [ $i -eq $view_index ]; then
                echo -e "\033[1;32m●  $option\033[0m"
            else
                echo -e "○  $option"
            fi
            i=$((i + 1))
        done
    }

    while true;do
       show_select
       read -rs -n 1
       case "$REPLY" in
           A) selected=$((selected-1)) ;;
           B) selected=$((selected+1)) ;;
           "") break ;;
       esac
       if [ $selected -lt 0 ]; then
           selected=$((option_length - 1))
       elif [ $selected -ge ${#options[@]} ]; then
           selected=0
       fi
    done

    SELECTED_INDEX=$selected
    IFS="$OLDIFS"
}

function confirm() {
    if [ "$1" != "" ]; then
        echo -e "$1"
    fi
    read -p "Confirm? [Y/n] "
    [ "$REPLY" = Yy ] || [ -z "$REPLY" ] || exit 0
}

function trigger() {
    IFS="$OLDIFS"
    local inputs_list=($INPUTS)
    local params="-f \"ref=$BRANCH\""
    for input in "${inputs_list[@]}" 
    do
        KEY=$(echo $input | cut -d '=' -f 1)
        VALUE=$(echo $input | cut -d '=' -f 2)
        params="$params -f \"inputs[$KEY]=$VALUE\" "
    done

    echo "Will trigger workflow $(r $WORKFLOW) on repository $(r $REPO) with branch $(r $BRANCH) and providing the following inputs:"
    for input in "${inputs_list[@]}"; do
        echo "$(g $input)"
    done
    confirm

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

function get_workflow_runid() {
    IFS="$OLDIFS"
    local get_run_id_try=0
    local get_run_id_cmd="gh api \
        --method GET \
        -H 'Accept: application/vnd.github+json' \
        -H 'X-GitHub-Api-Version: 2022-11-28' \
        /repos/$REPO/actions/workflows/$WORKFLOW/runs \
        -f 'per_page=20'\
        --jq '.workflow_runs | map(select(.conclusion == null)) | .[0] | @text \"\(.id) | \(.run_number)\"' \
    "
    local result=$(echo "$get_run_id_cmd" | sh)
    RUN_ID=($(echo "$result" | cut -d '|' -f1))
    RUN_NUMBER=($(echo "$result" | cut -d '|' -f2))
    if [ "$RUN_ID" = "null" ]; then
        RUN_ID=""
    fi
    if [ "$RUN_NUMBER" = "null" ]; then
        RUN_NUMBER=""
    fi
    while [ "$RUN_ID" == "" ] && [ $get_run_id_try -lt 6 ]; do
        clear
        echo "Get running id, retring $get_run_id_try/5 times..."
        get_run_id_try=$((get_run_id_try+1))
        sleep 5
        result=$(echo "$get_run_id_cmd" | sh)
        RUN_ID=($(echo "$result" | cut -d '|' -f1))
        RUN_NUMBER=($(echo "$result" | cut -d '|' -f2))
        if [ "$RUN_ID" = "null" ]; then
            RUN_ID=""
        fi
        if [ "$RUN_NUMBER" = "null" ]; then
            RUN_NUMBER=""
        fi
    done
}

function show_status() {
    local status_cmd
    local result
    local status
    local conclusion
    local time
    local duration
    local show_status

    IFS="$OLDIFS"
    if [ "$RUN_ID" != "" ]; then
        status_cmd="gh api \
            --method GET \
            -H 'Accept: application/vnd.github+json' \
            -H 'X-GitHub-Api-Version: 2022-11-28' \
            /repos/$REPO/actions/runs/$RUN_ID \
            --template '{{.status}} | {{.conclusion | truncate 20}} | {{.run_started_at}} | {{.run_number}}'
        "
        result=$(echo $status_cmd | sh)
        status=($(echo "$result" | cut -d '|' -f1))
        conclusion=($(echo "$result" | cut -d '|' -f2))
        time=($(echo "$result" | cut -d '|' -f3))
        if [ "$RUN_NUMBER" = "" ]; then
            RUN_NUMBER=($(echo "$result" | cut -d '|' -f4))
        fi
        while [ "$status" = "in_progress" ] || [ "$status" = "" ] || [ "$conclusion" = "" ]; do
            clear
            duration=$( [ "$(uname)" = "Linux" ] && echo "$(date -d "$time" "+%s")" || echo "$(date -u -jf "%Y-%m-%dT%H:%M:%SZ" "$time" "+%s")" )
            duration=$(( $(date "+%s") - $duration ))
            if [ $duration -ge 120 ]; then
                local m=$((duration/60))
                local s=$((duration%60))
                duration="${m}min"
                if [ "$s" -gt 0 ]; then
                    duration="$duration${s}s"
                fi
            else
                duration="${duration}s"
            fi
            show_status=$( [ "$conclusion" = "" ] && echo "$status" || echo "$conclusion" )
            echo "Workflow $(g $WORKFLOW) RunID: $(b $RUN_ID) $(g $show_status) $duration"
            echo "Open https://github.com/$REPO/actions/runs/$RUN_ID view more detail"
            sleep 1
            result=$(echo $status_cmd | sh)
            status=($(echo "$result" | cut -d '|' -f1))
            conclusion=($(echo "$result"| cut -d '|' -f2))
        done
        clear
        echo "Workflow $(g $WORKFLOW) has finished with result: $( [ "$conclusion" = "success" ] && echo $(g $conclusion) || echo $(r $conclusion) )"
        download_log
        echo -en "\a"
        echo "Open https://github.com/$REPO/actions/runs/$RUN_ID view more detail"
    else
        echo "No running workflow"
    fi
}

function download_log() {
    if [ "$RUN_ID" = "" ]; then
       exit 0
    fi
    gh api \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/$REPO/actions/runs/$RUN_ID/logs > ./$RUN_ID.zip
    mkdir -p ./run_logs/
    command -v unzip > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        mv ./$RUN_ID.zip ./run_logs/$RUN_ID.zip
        echo "Log file downloaded to $SCRIPT_DIR/run_logs/$RUN_ID.zip"
        exit 0
    fi
    local logfile="$SCRIPT_DIR/run_logs/$WORKFLOW_NAME-$RUN_NUMBER-$RUN_ID.log"
    echo -n "" > "$logfile"
    IFS=$'\n'
    local files=($(unzip -l ./$RUN_ID.zip [0-9]*.txt | grep -oG "[0-9]*_.*\.txt" | sort -n))
    for file in "${files[@]}"; do
        unzip -p ./$RUN_ID.zip "$file" >> "$logfile"
    done
    echo "Log file downloaded to $logfile"
    if [ "$CMD" != "status" ]; then
    rm -f ./$RUN_ID.zip
    fi
}

function main() {
    check_env

    REPO=$(git remote get-url origin | awk -F ':' '{print $2}')
    REPO=${REPO%.git}
    REPO=${REPO/https:\/\//}

    [ "$BRANCH" = "" ] && BRANCH=$(git branch --show-current)

    IFS="|"
    select_option "Select Workflow: " "${WORKFLOWS[*]}"

    WORKFLOW=${WORKFLOWS[$SELECTED_INDEX]}
    WORKFLOW_NAME=${WORKFLOW%.yml}

    echo "Workflow $(g $WORKFLOW) selected"

    if [ "$CMD" = "status" ]; then
        if [ "$EXTRAS" = "" ]; then
        get_workflow_runid
        else
            IFS="$OLDIFS"
            local extras=($EXTRAS)
            RUN_ID=${extras[0]}
        fi
        show_status
    else
        trigger
        get_workflow_runid
        show_status
    fi
}


while [ $# -gt 0 ]; do
    case $1 in
        status)
            CMD="status"
            ;;
        --branch)
            BRANCH="$2"
            shift
            ;;
        *=*)
            INPUTS="$INPUTS $1 "
            ;;
        *)
            EXTRAS="$EXTRAS $1"
            ;;
    esac
    shift
done

main