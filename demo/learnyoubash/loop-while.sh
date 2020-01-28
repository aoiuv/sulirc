#!/usr/bin/env bash

x=0
while [[ $x -lt 10 ]]; do
	echo $(($x * $x))
	x=`expr $x + 1`
done

