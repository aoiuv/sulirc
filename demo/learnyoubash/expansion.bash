#!/usr/bin/env bash

param1=${1:-1}
param2=${2:-5}
param3=${3:-6}
RESULT=$(( ($param1*$param2 + $param1*$param3) ))
# echo $RESULT

project="project-$RESULT"
# echo "$project"

echo $(echo $project)/{src,dest,test}/{index.js,util.js}
