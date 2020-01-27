#!/usr/bin/env bash

# Brace expansion
echo beg{i,a,u}n # begin began begun
echo {0..5} # o? haskell comprehension?
echo {00..8..2} # begin range step

# Command substitution
now=`date +%T`
now_=$(date +%T)

echo $now
echo $now_

# Arithmetic expansion
result=$(( ((10 + 5*3) - 7) / 2  ))
echo $result
