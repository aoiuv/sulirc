#!/usr/bin/env bash

if [[ $1 -lt 0 || $1 -gt 24 ]]; then
	echo "Error!"
elif [[ $1 -lt 12 ]]; then
	echo "Good morning!"
elif [[ $1 -ge 12 && $1 -lt 18 ]]; then
	echo "Good afternoon!"
else
	echo "Good evening!"
fi
