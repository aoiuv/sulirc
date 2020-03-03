#!/usr/bin/env bash

git checkout $(g branch | grep "push")

git branch | grep "push" | xargs git checkout

