#!/usr/bin/env bash

for i in {1..5}; do echo $i; done

for k in {1..6..2}; do
	echo $k
done

for (( v = 0; v < 10; v++ )); do
	echo $v
done

