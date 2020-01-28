#!/usr/bin/env bash

LOW=$1
HIGH=$2
# echo "low -> $LOW"
# echo "high -> $HIGH"
until [[ $LOW -ge $HIGH ]]; do
	if [[ $(($LOW % 2)) == 0 ]]; then 
		echo $LOW
	fi
	LOW=`expr $LOW + 1`
done
