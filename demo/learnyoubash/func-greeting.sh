#!/usr/bin/env bash

greeting () {
	if [[ -n $1 ]]; then
		echo "Hello, $1!"
	else
		echo "Hello, unknown!"
	fi
	return 0
}

greeting World
greeting
