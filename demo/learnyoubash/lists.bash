#!/usr/bin/env bash

$1 || echo 'First parameter is false.';
$2 && echo $PWD;
($3 && ls) || echo 'Third parameter is false.';
