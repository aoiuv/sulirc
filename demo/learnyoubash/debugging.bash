#!/usr/bin/env bash

set -v
echo $@
touch $@
mkdir ./folder
mv file* ./folder
cd ./folder
ls
set +v
