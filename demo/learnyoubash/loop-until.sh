#!/usr/bin/env bash

x=0
until [[ $x -ge 10 ]]; do
	echo $(($x * $x))
	x=`expr $x + 1`
done

